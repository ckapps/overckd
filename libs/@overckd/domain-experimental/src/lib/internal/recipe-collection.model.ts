import * as Schema from 'effect/Schema';
import {
  RecipeCollectionId,
  RecipeCollectionIdFromString,
} from './recipe-collection-shared.model';
import { RecipeRef, RecipeRefFromObject } from './recipe-ref.model';

export class RecipeCollection extends Schema.Class<RecipeCollection>(
  '@overckd/RecipeCollection',
)({
  id: RecipeCollectionId,
  name: Schema.NonEmptyString,
  description: Schema.String,
  recipes: Schema.Array(RecipeRef),
}) {}

export const Equivalence = Schema.equivalence(RecipeCollection);

export class RecipeCollectionNotFound extends Schema.TaggedError<RecipeCollectionNotFound>()(
  'RecipeCollectionNotFound',
  { id: RecipeCollectionId },
) {}

export const RecipeCollectionFromObject = Schema.Struct({
  id: RecipeCollectionIdFromString,
  name: Schema.NonEmptyString,
  description: Schema.String,
  recipes: Schema.Array(RecipeRefFromObject),
}).pipe(Schema.compose(RecipeCollection));
