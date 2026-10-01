import { fromYamlString } from '@overckd/codec-yaml';
import {
  Compat,
  RecipeId,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { RecipeRepo } from '@overckd/recipe/application';
import { recipeRepoConformance } from '@overckd/testing';
import {
  Effect,
  Exit,
  FileSystem,
  Layer,
  Path,
  PlatformError,
  Schema,
} from 'effect';
import { describe, expect, it } from 'vitest';
import { RecipeRepoFs, RecipeRepoFsConfig } from './recipe-repo.fs';

const dir = '/app/recipes';

const notFound = (method: string, path: string) =>
  PlatformError.systemError({
    _tag: 'NotFound',
    module: 'FileSystem',
    method,
    pathOrDescriptor: path,
  });

/**
 * A file system with one directory, `dir`.
 * @param files The files in `dir`: name → text
 */
const fileSystem = (files: ReadonlyMap<string, string>) =>
  FileSystem.layerNoop({
    readDirectory: path =>
      path === dir
        ? Effect.succeed([...files.keys()])
        : Effect.fail(notFound('readDirectory', path)),
    readFileString: path => {
      const text = path.startsWith(`${dir}/`)
        ? files.get(path.slice(dir.length + 1))
        : undefined;
      return text === undefined
        ? Effect.fail(notFound('readFileString', path))
        : Effect.succeed(text);
    },
  });

const recipeRepoFs = (
  files: ReadonlyMap<string, string>,
  config: RecipeRepoFsConfig['Service'] = { dir },
) =>
  RecipeRepoFs.pipe(
    Layer.provide([
      Layer.succeed(RecipeRepoFsConfig, config),
      fileSystem(files),
      Path.layer,
    ]),
  );

const findById = (id: string) =>
  RecipeRepo.use(repo => repo.findById(RecipeId.make(id)));

const run = <A, E>(
  repo: Layer.Layer<RecipeRepo>,
  effect: Effect.Effect<A, E, RecipeRepo>,
) => Effect.runPromise(effect.pipe(Effect.provide(repo)));

/**
 * The text of a recipe file holding `recipe`. Unlike the files in `data/`, it
 * keeps the recipe's id.
 */
const recipeFile = (recipe: RecipePreparation) =>
  Schema.encodeSync(
    fromYamlString(
      Schema.Struct({
        overckd: Schema.Literal('1.0.0'),
        recipe: Compat.RecipePreparationLegacyJson,
      }),
    ),
  )({ overckd: '1.0.0', recipe });

const pancakesFile = `overckd: 1.0.0
recipe:
  name: Pancakes
  ingredients:
    - name: Flour
  steps:
    - Mix and fry
  tips: []
  images: []
  styles: {}
`;

describe('RecipeRepoFs', () => {
  recipeRepoConformance(seed =>
    recipeRepoFs(
      new Map(
        seed.map(recipe => [`${recipe.id}.recipe.yaml`, recipeFile(recipe)]),
      ),
    ),
  );

  it('should take the name as id, as the recipe files have none', async () => {
    const found = await run(
      recipeRepoFs(new Map([['pancakes.recipe.yaml', pancakesFile]])),
      findById('Pancakes'),
    );

    expect(found).toMatchObject({ id: 'Pancakes', name: 'Pancakes' });
  });

  it('should read only the *.recipe.yaml files', async () => {
    const repo = recipeRepoFs(
      new Map([
        ['pancakes.yaml', pancakesFile],
        ['README.md', 'Not a recipe'],
      ]),
    );

    const error = await run(repo, findById('Pancakes').pipe(Effect.flip));

    expect(error).toBeInstanceOf(RecipeNotFound);
  });

  it('should die on a broken recipe file', async () => {
    const repo = recipeRepoFs(
      new Map([
        ['pancakes.recipe.yaml', pancakesFile],
        ['broken.recipe.yaml', 'overckd: 1.0.0\nrecipe: {}\n'],
      ]),
    );

    const exit = await run(repo, findById('Pancakes').pipe(Effect.exit));

    expect(Exit.hasDies(exit)).toBe(true);
  });

  it('should die without the directory', async () => {
    const repo = recipeRepoFs(
      new Map([['pancakes.recipe.yaml', pancakesFile]]),
      {
        dir: '/elsewhere',
      },
    );

    const exit = await run(repo, findById('Pancakes').pipe(Effect.exit));

    expect(Exit.hasDies(exit)).toBe(true);
  });
});
