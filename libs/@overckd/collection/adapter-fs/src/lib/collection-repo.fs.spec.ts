import { CollectionRepo } from '@overckd/collection/application';
import { fromYamlString } from '@overckd/codec-yaml';
import { Collection, RecipeId } from '@overckd/domain-experimental';
import { collectionRepoConformance } from '@overckd/testing';
import { Effect, Exit, FileSystem, Layer, PlatformError, Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { CollectionRepoFs, CollectionRepoFsConfig } from './collection-repo.fs';

const file = '/app/overckd.collections.yaml';

const notFound = (method: string, path: string) =>
  PlatformError.systemError({
    _tag: 'NotFound',
    module: 'FileSystem',
    method,
    pathOrDescriptor: path,
  });

/**
 * A file system with the given files.
 * @param files The files: path → text
 */
const fileSystem = (files: ReadonlyMap<string, string>) =>
  FileSystem.layerNoop({
    readFileString: path => {
      const text = files.get(path);
      return text === undefined
        ? Effect.fail(notFound('readFileString', path))
        : Effect.succeed(text);
    },
  });

const collectionRepoFs = (
  files: ReadonlyMap<string, string>,
  config: CollectionRepoFsConfig['Service'] = { file },
) =>
  CollectionRepoFs.pipe(
    Layer.provide([
      Layer.succeed(CollectionRepoFsConfig, config),
      fileSystem(files),
    ]),
  );

const getAll = CollectionRepo.use(repo => repo.getAll);

const run = <A, E>(
  repo: Layer.Layer<CollectionRepo>,
  effect: Effect.Effect<A, E, CollectionRepo>,
) => Effect.runPromise(effect.pipe(Effect.provide(repo), Effect.exit));

const encodeYaml = Schema.encodeSync(fromYamlString(Schema.Unknown));

interface RecipeEntry {
  readonly name: string;
  readonly uri: string;
  readonly collections: ReadonlyArray<object>;
}

/**
 * The text of a collections file holding `collections`. As in the files in
 * `data/`, each recipe lists its collections through YAML anchors.
 */
const collectionsFile = (collections: ReadonlyArray<Collection>) => {
  const collectionEntries: Array<object> = [];
  const recipeEntries = new Map<RecipeId, RecipeEntry>();

  for (const { id, name, description, recipes } of collections) {
    const collection = { id, name, description };
    collectionEntries.push(collection);
    for (const recipe of recipes) {
      const entry = recipeEntries.get(recipe.id) ?? {
        name: recipe.name,
        uri: 'overckd://localhost',
        collections: [],
      };
      recipeEntries.set(recipe.id, {
        ...entry,
        collections: [...entry.collections, collection],
      });
    }
  }

  return encodeYaml({
    overckd: '1.0.0',
    collections: collectionEntries,
    recipes: Object.fromEntries(
      Array.from(recipeEntries.values(), (entry, i) => [
        `recipe_${i + 1}`,
        entry,
      ]),
    ),
  });
};

describe('CollectionRepoFs', () => {
  collectionRepoConformance(seed =>
    collectionRepoFs(new Map([[file, collectionsFile(seed)]])),
  );

  it('should die on a broken collections file', async () => {
    const repo = collectionRepoFs(
      new Map([[file, 'overckd: 1.0.0\ncollections: []\n']]),
    );

    const exit = await run(repo, getAll);

    expect(Exit.hasDies(exit)).toBe(true);
  });

  it('should die without the collections file', async () => {
    const repo = collectionRepoFs(new Map([[file, collectionsFile([])]]), {
      file: '/elsewhere/overckd.collections.yaml',
    });

    const exit = await run(repo, getAll);

    expect(Exit.hasDies(exit)).toBe(true);
  });
});
