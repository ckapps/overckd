import {
  CollectionRepoFs,
  CollectionRepoFsConfig,
} from '@overckd/collection/adapter-fs';
import { RecipeRepoFs, RecipeRepoFsConfig } from '@overckd/recipe/adapter-fs';
import { Layer } from 'effect';
import { AppDirectory } from './app-directory';

/**
 * File repositories on the app directory, which read the files on every call.
 * The recipes link their images under `mediaUrl`.
 */
export const RepositoriesLive = (mediaUrl: string) =>
  Layer.mergeAll(
    RecipeRepoFs.pipe(
      Layer.provide(
        Layer.effect(
          RecipeRepoFsConfig,
          AppDirectory.useSync(({ recipes }) =>
            RecipeRepoFsConfig.of({ dir: recipes, codec: 'yaml', mediaUrl }),
          ),
        ),
      ),
    ),
    CollectionRepoFs.pipe(
      Layer.provide(
        Layer.effect(
          CollectionRepoFsConfig,
          AppDirectory.useSync(({ collectionsFile }) =>
            CollectionRepoFsConfig.of({ file: collectionsFile, codec: 'yaml' }),
          ),
        ),
      ),
    ),
  );
