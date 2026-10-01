import { RecipeFileYaml } from '@overckd/codec-yaml';
import {
  RecipeId,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { RecipeRepo } from '@overckd/recipe/application';
import { Context, Effect, FileSystem, Layer, Path, Schema } from 'effect';

const recipeFileSuffix = '.recipe.yaml';

/** Configuration of `RecipeRepoFs`, provided by the app. */
export class RecipeRepoFsConfig extends Context.Service<
  RecipeRepoFsConfig,
  {
    /** The directory with the recipe files */
    readonly dir: string;
  }
>()('@overckd/recipe/adapter-fs/RecipeRepoFsConfig') {}

/**
 * `RecipeRepo` that reads the recipe files (`*.recipe.yaml`) in the directory
 * of `RecipeRepoFsConfig`, as the legacy desktop does: other files and
 * subdirectories are left out. It reads the files on every call, so it sees
 * changes made on disk.
 */
export const RecipeRepoFs = Layer.effect(
  RecipeRepo,
  Effect.gen(function* () {
    const { dir } = yield* RecipeRepoFsConfig;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const decode = Schema.decodeEffect(RecipeFileYaml);

    const readRecipeFile = (name: string) =>
      fs.readFileString(path.join(dir, name)).pipe(Effect.flatMap(decode));

    const readAll: Effect.Effect<ReadonlyArray<RecipePreparation>> = fs
      .readDirectory(dir)
      .pipe(
        Effect.map(names =>
          names.filter(name => name.endsWith(recipeFileSuffix)),
        ),
        Effect.flatMap(names =>
          Effect.forEach(names, readRecipeFile, {
            concurrency: 'unbounded',
          }),
        ),
        // I/O and decoding failures are defects: the port declares no error
        // for a missing directory or a broken file.
        Effect.orDie,
      );

    return RecipeRepo.of({
      findById: Effect.fn('RecipeRepo.findById')(function* (id: RecipeId) {
        const recipe = (yield* readAll).find(recipe => recipe.id === id);
        if (recipe === undefined) {
          return yield* new RecipeNotFound({ id });
        }
        return recipe;
      }),
    });
  }),
);
