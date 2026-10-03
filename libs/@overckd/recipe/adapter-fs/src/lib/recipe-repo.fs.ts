import {
  RecipeId,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { RecipeRepo } from '@overckd/recipe/application';
import {
  Context,
  Effect,
  Exit,
  FileSystem,
  Layer,
  Path,
  Request,
  RequestResolver,
} from 'effect';
import {
  readRecipeFile,
  RecipeFileCodec,
  recipeFileFormats,
} from './recipe-file';

/** Configuration of `RecipeRepoFs`, provided by the app. */
export class RecipeRepoFsConfig extends Context.Service<
  RecipeRepoFsConfig,
  {
    /** The directory with the recipe files */
    readonly dir: string;
    /** The codec of the recipe files, which also gives the suffix of their names */
    readonly codec: RecipeFileCodec;
  }
>()('@overckd/recipe/adapter-fs/RecipeRepoFsConfig') {}

/** A `findById` lookup request */
class FindRecipeById extends Request.Class<
  { readonly id: RecipeId },
  RecipePreparation,
  RecipeNotFound
> {}

/**
 * `RecipeRepo` that reads the recipe files for every lookup, so it sees
 * changes made on disk. Lookups made at the same time share one read of the
 * files.
 */
export const RecipeRepoFs = Layer.effect(
  RecipeRepo,
  Effect.gen(function* () {
    const { dir, codec } = yield* RecipeRepoFsConfig;
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const { suffix } = recipeFileFormats[codec];

    const readAll = Effect.gen(function* () {
      const names = yield* fs.readDirectory(dir);
      return yield* Effect.forEach(
        names.filter(name => name.endsWith(suffix)),
        name => readRecipeFile(path.join(dir, name), codec),
        { concurrency: 'unbounded' },
      );
    }).pipe(Effect.provideService(FileSystem.FileSystem, fs), Effect.orDie);

    // Answers all lookups of a batch from one read of the files
    const FindByIdResolver = RequestResolver.make<FindRecipeById>(
      Effect.fnUntraced(function* (entries) {
        const recipes = yield* readAll;
        for (const entry of entries) {
          const { id } = entry.request;
          const recipe = recipes.find(recipe => recipe.id === id);
          entry.completeUnsafe(
            recipe === undefined
              ? Exit.fail(new RecipeNotFound({ id }))
              : Exit.succeed(recipe),
          );
        }
      }),
    ).pipe(RequestResolver.withSpan('RecipeRepo.findById.resolver'));

    return RecipeRepo.of({
      findById: Effect.fn('RecipeRepo.findById')((id: RecipeId) =>
        Effect.request(new FindRecipeById({ id }), FindByIdResolver),
      ),
    });
  }),
);
