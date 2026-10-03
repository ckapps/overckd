import { CollectionsFileYaml } from '@overckd/codec-yaml';
import { Effect, FileSystem, Schema } from 'effect';

/**
 * The formats of the recipe files, by the name of their codec: the schema that
 * decodes a file, and the suffix of its name.
 */
export const collectionsFileFormats = {
  yaml: { codec: CollectionsFileYaml, suffix: '.collections.yaml' },
} as const;

/** The name of a recipe file codec, as in `RecipeRepoFsConfig` */
export type CollectionsFileCodec = keyof typeof collectionsFileFormats;

/**
 * Reads the collections file (`overckd.collections.yaml`) at `file`. Its
 * errors stay typed: the caller decides what they mean.
 */
export const readCollectionsFile = Effect.fn('readCollectionsFile')(function* (
  file: string,
  codec: CollectionsFileCodec,
) {
  const fs = yield* FileSystem.FileSystem;
  const text = yield* fs.readFileString(file);
  return yield* Schema.decodeEffect(collectionsFileFormats[codec].codec)(text);
});
