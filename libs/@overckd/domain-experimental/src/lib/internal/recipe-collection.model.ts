import * as HttpApiSchema from '@effect/platform/HttpApiSchema';
import * as Schema from 'effect/Schema';
import { RecipeRef, RecipeRefJson } from './recipe.model';

/**
 * @category Symbols
 */
export const RecipeCollectionIdTypeId: unique symbol = Symbol.for(
  '@overckd/RecipeCollectionId',
);

/**
 * @category Models
 */
export type RecipeCollectionId = typeof RecipeCollectionId.Type;
export const RecipeCollectionId = Schema.NonEmptyString.pipe(
  Schema.brand(RecipeCollectionIdTypeId),
).annotations({
  identifier: 'RecipeCollectionId',
  description: 'Identifier for a recipe collection',
});

/**
 * @category Schemas
 */
export const RecipeCollectionIdFromString = Schema.NonEmptyString.pipe(
  Schema.compose(RecipeCollectionId),
);

/**
 * @category Models
 */
export class RecipeCollection extends Schema.Class<RecipeCollection>(
  '@overckd/RecipeCollection',
)(
  {
    id: RecipeCollectionId,
    name: Schema.NonEmptyString,
    description: Schema.String,
    recipes: Schema.Array(RecipeRef),
  },
  {
    identifier: 'RecipeCollection',
    title: 'Recipe Collection',
    description: 'A collection of recipes',
  },
) {}

/**
 * @category instances
 */
export const Equivalence = Schema.equivalence(RecipeCollection);

/**
 * @category Errors
 */
export class RecipeCollectionNotFound extends Schema.TaggedError<RecipeCollectionNotFound>()(
  'RecipeCollectionNotFound',
  { id: RecipeCollectionId },
  HttpApiSchema.annotations({ status: 404 }),
) {}

/**
 * @category Schemas
 */
export const RecipeCollectionJson = Schema.Struct({
  id: RecipeCollectionIdFromString,
  name: Schema.NonEmptyString,
  description: Schema.String,
  recipes: Schema.Array(RecipeRefJson),
}).pipe(Schema.compose(RecipeCollection));
