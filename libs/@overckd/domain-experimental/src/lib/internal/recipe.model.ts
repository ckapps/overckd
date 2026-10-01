import { Schema } from 'effect';

/**
 * @category Brands
 */
export const RecipeIdTypeId = '@overckd/RecipeId';

/**
 * @category Models
 */
export type RecipeId = typeof RecipeId.Type;
export const RecipeId = Schema.NonEmptyString.pipe(
  Schema.brand(RecipeIdTypeId),
).annotate({
  identifier: 'RecipeId',
  title: 'Recipe ID',
  description: 'A unique identifier for a recipe',
});

/**
 * @category Schemas
 */
export const RecipeIdFromString = Schema.String.pipe(Schema.decodeTo(RecipeId));

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
export const Equivalence = Schema.toEquivalence(RecipeRef);

/**
 * @category Errors
 */
export class RecipeNotFound extends Schema.TaggedError<RecipeNotFound>()(
  'RecipeNotFound',
  { id: RecipeId },
) {}

/**
 * @category Payloads
 */
export type RecipeFindByIdPayload = typeof RecipeFindByIdPayload.Type;
export const RecipeFindByIdPayload = Schema.Struct({
  /** Id of the recipe. */
  id: RecipeId,
});

/**
 * @category Errors
 */
export type RecipeFindByIdError = RecipeNotFound;

/**
 * @category Schemas
 */
export const RecipeRefJson = Schema.Struct({
  id: RecipeIdFromString,
  name: Schema.NonEmptyString,
}).pipe(Schema.decodeTo(RecipeRef));
