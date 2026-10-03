import { RecipeFileYaml } from '@overckd/codec-yaml';
import { Effect, FileSystem, Schema } from 'effect';

/**
 * The formats of the recipe files, by the name of their codec: the schema that
 * decodes a file, and the suffix of its name.
 */
export const recipeFileFormats = {
  yaml: { codec: RecipeFileYaml, suffix: '.recipe.yaml' },
} as const;

/** The name of a recipe file codec, as in `RecipeRepoFsConfig` */
export type RecipeFileCodec = keyof typeof recipeFileFormats;

/**
 * Reads the recipe file at `path`, decoded with `codec`. Its errors stay
 * typed: the caller decides what they mean.
 */
export const readRecipeFile = Effect.fn('readRecipeFile')(function* (
  path: string,
  codec: RecipeFileCodec,
) {
  const fs = yield* FileSystem.FileSystem;
  const text = yield* fs.readFileString(path);
  return yield* Schema.decodeEffect(recipeFileFormats[codec].codec)(text);
});
