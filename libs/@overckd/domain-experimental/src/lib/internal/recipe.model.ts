import * as Schema from 'effect/Schema';

/**
 * @category Symbols
 */
export const RecipeIdTypeId: unique symbol = Symbol.for('@overckd/RecipeId');

/**
 * @category Models
 */
export type RecipeId = typeof RecipeId.Type;
export const RecipeId = Schema.NonEmptyString.pipe(
  Schema.brand(RecipeIdTypeId),
).annotations({ identifier: 'RecipeId' });

/**
 * @category Schemas
 */
export const RecipeIdFromString = Schema.String.pipe(Schema.compose(RecipeId));

/**
 * @category Models
 */
export class RecipeRef extends Schema.Class<RecipeRef>('@overckd/RecipeRef')(
  {
    id: RecipeId,
    name: Schema.NonEmptyString,
  },
  {
    identifier: 'RecipeRef',
    title: 'Recipe Reference',
    description: 'A minimal reference to a recipe',
  },
) {}

/**
 * @category instances
 */
export const Equivalence = Schema.equivalence(RecipeRef);

/**
 * @category Schemas
 */
export const RecipeRefJson = Schema.Struct({
  id: RecipeIdFromString,
  name: Schema.NonEmptyString,
}).pipe(Schema.compose(RecipeRef));
