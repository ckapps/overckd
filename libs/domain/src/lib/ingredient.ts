import * as Schema from 'effect/Schema';
import * as Tag from './tag';
import * as Uri from './uri';

export class IngredientBase extends Schema.Class<Ingredient>(
  '@overckd/IngredientBase',
)({
  /** * URI identifying this ingredient. */
  uri: Uri.Uri,
  /** Name of the ingredient. */
  name: Schema.NonEmptyString,
}) {}

export class Ingredient extends Schema.Class<Ingredient>('@overckd/Ingredient')(
  {
    /** * URI identisfying this ingredient. */
    uri: Uri.Uri,
    /** Name of the ingredient. */
    name: Schema.NonEmptyString,
    tags: Schema.Array(Tag.Tag),
  },
) {}

export const Equivalence = Schema.equivalence(Ingredient);
