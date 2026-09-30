import {
  NonEmptyHtmlString,
  RecipeId,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { Effect, Layer, Option } from 'effect';
import { describe, expect, it } from 'vitest';
import { RecipeQueries } from './recipe-queries';
import { RecipeQueriesLocal } from './recipe-queries.local';
import { RecipeRepo } from './recipe-repo';

const pancakes: RecipePreparation = {
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make('pancakes'),
  name: 'Pancakes',
  basedOn: [],
  ingredients: [],
  portion: { kind: 'quantity', label: Option.none(), quantity: 4 },
  steps: [{ instruction: NonEmptyHtmlString.make('Mix and fry') }],
};

describe('RecipeQueriesLocal', () => {
  it('finds a recipe by its id', async () => {
    const repo = Layer.mock(RecipeRepo, {
      findById: () => Effect.succeed(pancakes),
    });

    const recipe = await Effect.runPromise(
      RecipeQueries.use(queries => queries.findById(pancakes.id)).pipe(
        Effect.provide(RecipeQueriesLocal.pipe(Layer.provide(repo))),
      ),
    );

    expect(recipe).toEqual(pancakes);
  });

  it('fails with RecipeNotFound for unknown ids', async () => {
    const repo = Layer.mock(RecipeRepo, {
      findById: id => Effect.fail(new RecipeNotFound({ id })),
    });

    const error = await Effect.runPromise(
      RecipeQueries.use(queries =>
        queries.findById(RecipeId.make('nope')),
      ).pipe(
        Effect.flip,
        Effect.provide(RecipeQueriesLocal.pipe(Layer.provide(repo))),
      ),
    );

    expect(error).toBeInstanceOf(RecipeNotFound);
  });
});
