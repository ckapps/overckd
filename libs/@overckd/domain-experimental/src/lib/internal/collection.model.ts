import * as HttpApiSchema from '@effect/platform/HttpApiSchema';
import * as Schema from 'effect/Schema';
import { RecipeRef, RecipeRefJson } from './recipe.model';

/**
 * @category Symbols
 */
export const CollectionIdTypeId: unique symbol = Symbol.for(
  '@overckd/CollectionId',
);

/**
 * @category Models
 */
export type CollectionId = typeof CollectionId.Type;
export const CollectionId = Schema.NonEmptyString.pipe(
  Schema.brand(CollectionIdTypeId),
).annotations({
  identifier: 'CollectionId',
  description: 'Identifier for a recipe collection',
});

/**
 * @category Schemas
 */
export const CollectionIdFromString = Schema.NonEmptyString.pipe(
  Schema.compose(CollectionId),
);

/**
 * @category Models
 */
export class Collection extends Schema.Class<Collection>('@overckd/collection')(
  {
    id: CollectionId,
    name: Schema.NonEmptyString,
    description: Schema.String,
    recipes: Schema.Array(RecipeRef),
  },
  {
    identifier: 'Collection',
    title: 'Collection',
    description: 'A collection of recipes',
  },
) {}

/**
 * @category instances
 */
export const Equivalence = Schema.equivalence(Collection);

/**
 * @category Errors
 */
export class CollectionNotFound extends Schema.TaggedError<CollectionNotFound>()(
  'CollectionNotFound',
  { id: CollectionId },
  HttpApiSchema.annotations({ status: 404 }),
) {}

/**
 * @category Schemas
 */
export const CollectionJson = Schema.Struct({
  id: CollectionIdFromString,
  name: Schema.NonEmptyString,
  description: Schema.String,
  recipes: Schema.Array(RecipeRefJson),
}).pipe(Schema.compose(Collection));
