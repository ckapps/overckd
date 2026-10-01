import { CollectionRepo } from '@overckd/collection/application';
import { CollectionsFileYaml } from '@overckd/codec-yaml';
import {
  Collection,
  CollectionId,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Context, Effect, FileSystem, Layer, Schema } from 'effect';

/** Configuration of `CollectionRepoFs`, provided by the app. */
export class CollectionRepoFsConfig extends Context.Service<
  CollectionRepoFsConfig,
  {
    /** The collections file (`overckd.collections.yaml`) */
    readonly file: string;
  }
>()('@overckd/collection/adapter-fs/CollectionRepoFsConfig') {}

/**
 * `CollectionRepo` that reads the collections file of
 * `CollectionRepoFsConfig`. It reads the file on every call, so it sees
 * changes made on disk.
 */
export const CollectionRepoFs = Layer.effect(
  CollectionRepo,
  Effect.gen(function* () {
    const { file } = yield* CollectionRepoFsConfig;
    const fs = yield* FileSystem.FileSystem;
    const decode = Schema.decodeEffect(CollectionsFileYaml);

    const readAll: Effect.Effect<ReadonlyArray<Collection>> = fs
      .readFileString(file)
      .pipe(
        Effect.flatMap(decode),
        // I/O and decoding failures are defects: the port declares no error
        // for a missing or broken file.
        Effect.orDie,
      );

    return CollectionRepo.of({
      getAll: readAll.pipe(Effect.withSpan('CollectionRepo.getAll')),
      findById: Effect.fn('CollectionRepo.findById')(function* (
        id: CollectionId,
      ) {
        const collection = (yield* readAll).find(
          collection => collection.id === id,
        );
        if (collection === undefined) {
          return yield* new CollectionNotFound({ id });
        }
        return collection;
      }),
    });
  }),
);
