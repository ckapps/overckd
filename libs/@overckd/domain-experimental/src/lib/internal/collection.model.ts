import { Schema, SchemaTransformation } from 'effect';
import { RecipeRef, RecipeRefJson } from './recipe.model';

/**
 * @category Brands
 */
export const CollectionIdTypeId = '@overckd/CollectionId';

/**
 * @category Models
 */
export type CollectionId = typeof CollectionId.Type;
export const CollectionId = Schema.NonEmptyString.pipe(
  Schema.brand(CollectionIdTypeId),
).annotate({
  identifier: 'CollectionId',
  description: 'Identifier for a recipe collection',
});

/**
 * @category Schemas
 */
export const CollectionIdFromString = Schema.NonEmptyString.pipe(
  Schema.decodeTo(CollectionId),
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
export const Equivalence = Schema.toEquivalence(Collection);

/**
 * @category Errors
 */
export class CollectionNotFound extends Schema.TaggedError<CollectionNotFound>()(
  'CollectionNotFound',
  { id: CollectionId },
  { httpApiStatus: 404 },
) {}

/**
 * @category Schemas
 */
export const CollectionJson = Schema.Struct({
  id: CollectionIdFromString,
  name: Schema.NonEmptyString,
  description: Schema.String,
  recipes: Schema.Array(RecipeRefJson),
}).pipe(
  // Decode to the type side, so encoding hands the nested `RecipeRef`
  // instances to `RecipeRefJson` instead of their encoded plain objects.
  Schema.decodeTo(
    Schema.toType(Collection),
    SchemaTransformation.transform({
      decode: fields => Collection.make(fields),
      encode: collection => collection,
    }),
  ),
);
