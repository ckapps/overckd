import * as Schema from 'effect/Schema';

export const RecipeIdTypeId: unique symbol = Symbol.for('@overckd/RecipeId');

export type RecipeId = typeof RecipeId.Type;
export const RecipeId = Schema.NonEmptyString.pipe(
  Schema.brand(RecipeIdTypeId),
).annotations({ identifier: 'RecipeId' });

export const RecipeIdFromString = Schema.String.pipe(Schema.compose(RecipeId));
