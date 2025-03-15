import * as Schema from 'effect/Schema';
import { RecipeId, RecipeIdFromString } from './recipe-shared.model';

export class RecipeRef extends Schema.Class<RecipeRef>('@overckd/RecipeRef')({
  id: RecipeId,
  name: Schema.NonEmptyString,
}) {}

export const Equivalence = Schema.equivalence(RecipeRef);

export const RecipeRefFromObject = Schema.Struct({
  id: RecipeIdFromString,
  name: Schema.NonEmptyString,
}).pipe(Schema.compose(RecipeRef));
