import {
  CollectionRepoFs,
  CollectionRepoFsConfig,
} from '@overckd/collection/adapter-fs';
import { RecipeRepoFs, RecipeRepoFsConfig } from '@overckd/recipe/adapter-fs';
import { Layer, Schema } from 'effect';
import { FilesystemRepositoriesConfig } from './repositories.config';

/** Configuration of the file-based recipe repository. */
export const FilesystemRecipeRepositoryConfig = Schema.Struct({
  dir: Schema.String.annotate({
    description:
      'The directory of the *.recipe.yaml files, relative to the config file',
  }),
});
export type FilesystemRecipeRepositoryConfig = Schema.Schema.Type<
  typeof FilesystemRecipeRepositoryConfig
>;

/** Configuration of the file-based collection repository. */
export const FilesystemCollectionRepositoryConfig = Schema.Struct({
  file: Schema.String.annotate({
    description:
      'The collections file (overckd.collections.yaml), relative to the config file',
  }),
});
export type FilesystemCollectionRepositoryConfig = Schema.Schema.Type<
  typeof FilesystemCollectionRepositoryConfig
>;

/** File repositories, which read the files on every call */
export const FilesystemReposLive = ({
  recipes,
  collections,
}: FilesystemRepositoriesConfig) =>
  Layer.mergeAll(
    RecipeRepoFs.pipe(
      Layer.provide(
        Layer.succeed(
          RecipeRepoFsConfig,
          RecipeRepoFsConfig.of({ dir: recipes.dir, codec: 'yaml' }),
        ),
      ),
    ),
    CollectionRepoFs.pipe(
      Layer.provide(
        Layer.succeed(
          CollectionRepoFsConfig,
          CollectionRepoFsConfig.of({ file: collections.file, codec: 'yaml' }),
        ),
      ),
    ),
  );
