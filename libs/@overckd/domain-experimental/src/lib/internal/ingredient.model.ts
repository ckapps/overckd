import { Schema } from 'effect';
import { Tag } from './tag.model';

/**
 * @category Brands
 */
export const IngredientIdTypeId = '@overckd/IngredientId';

/**
 * @category Models
 */
export type IngredientId = typeof IngredientId.Type;
export const IngredientId = Schema.NonEmptyString.pipe(
  Schema.brand(IngredientIdTypeId),
).annotate({ identifier: 'IngredientId' });

/**
 * @category Models
 */
export class Ingredient extends Schema.Class<Ingredient>('@overckd/Ingredient')(
  {
    /** ingredient URI. */
    uri: IngredientId,
    /** the name of the ingredient. */
    name: Schema.NonEmptyString,
    /** Tags for ingredient. */
    tags: Schema.Array(Tag),
  },
  {
    identifier: 'Ingredient',
    title: 'Ingredient',
    description: 'An ingredient',
  },
) {}

/**
 * @category Errors
 */
export class IngredientNotFound extends Schema.TaggedError<IngredientNotFound>()(
  'IngredientNotFound',
  { id: IngredientId },
  { httpApiStatus: 404 },
) {}

/**
 * @category instances
 */
export const Equivalence = Schema.toEquivalence(Ingredient);

/**
 * @category Schemas
 */
export const IngredientIdFromString = Schema.String.pipe(
  Schema.decodeTo(IngredientId),
);
