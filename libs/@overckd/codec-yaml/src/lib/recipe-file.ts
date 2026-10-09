import { RecipePreparation } from '@overckd/domain';
import { Schema, SchemaGetter } from 'effect';
import { overckdFile } from './overckd-file';
import { RecipePreparationLegacyJson } from './recipe-yaml';
import { fromYamlString } from './yaml';

/**
 * A recipe file (`*.recipe.yaml`): YAML text → `RecipePreparation`.
 *
 * The `recipe` of the file has the shape of the legacy recipe JSON, so it is
 * read with `RecipePreparationLegacyJson`, which takes the name as the id.
 * Decoding only: the encoding would drop styles, timers and YAML anchors, so it
 * waits for the first command that writes a recipe file.
 */
export const RecipeFileYaml = fromYamlString(
  overckdFile({ recipe: RecipePreparationLegacyJson }),
).pipe(
  Schema.decodeTo(Schema.toType(RecipePreparation), {
    decode: SchemaGetter.transform(file => file.recipe),
    encode: SchemaGetter.forbiddenEncoding,
  }),
);
