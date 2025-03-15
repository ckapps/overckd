import * as Schema from 'effect/Schema';

export const RecipeCollectionIdTypeId: unique symbol = Symbol.for(
  '@overckd/RecipeCollectionId',
);

export type RecipeCollectionId = typeof RecipeCollectionId.Type;
export const RecipeCollectionId = Schema.NonEmptyString.pipe(
  Schema.brand(RecipeCollectionIdTypeId),
).annotations({ identifier: 'RecipeCollectionId' });

export const RecipeCollectionIdFromString = Schema.String.pipe(
  Schema.compose(RecipeCollectionId),
);
