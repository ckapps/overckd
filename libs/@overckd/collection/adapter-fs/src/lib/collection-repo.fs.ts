import { CollectionRepo } from '@overckd/collection/application';
import { CollectionId, CollectionNotFound } from '@overckd/domain';
import { Context, Effect, FileSystem, Layer } from 'effect';
import { CollectionsFileCodec, readCollectionsFile } from './collection-file';

/** Configuration of `CollectionRepoFs`, provided by the app. */
export class CollectionRepoFsConfig extends Context.Service<
  CollectionRepoFsConfig,
  {
    /** The collections file (`overckd.collections.yaml`) */
    readonly file: string;
    /** The codec of the recipe files, which also gives the suffix of their names */
    readonly codec: CollectionsFileCodec;
  }
>()('@overckd/collection/adapter-fs/CollectionRepoFsConfig') {}

/**
 * `CollectionRepo` that reads the collections file with `readCollectionsFile`
 * on every call, so it sees changes made on disk.
 */
export const CollectionRepoFs = Layer.effect(
  CollectionRepo,
  Effect.gen(function* () {
    const { file, codec } = yield* CollectionRepoFsConfig;
    const fs = yield* FileSystem.FileSystem;
    const readAll = readCollectionsFile(file, codec).pipe(
      Effect.provideService(FileSystem.FileSystem, fs),
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
