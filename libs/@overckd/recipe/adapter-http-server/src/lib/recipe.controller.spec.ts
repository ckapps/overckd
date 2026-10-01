import { OverckdApi } from '@overckd/api-http';
import {
  IngredientId,
  NonEmptyHtmlString,
  RecipeId,
  RecipeIngredient,
  RecipeNotFound,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { RecipeQueries } from '@overckd/recipe/application';
import { Effect, Layer, Option, Scope } from 'effect';
import { HttpServer } from 'effect/http';
import { HttpApiTest } from 'effect/http-api';
import { describe, expect, it } from 'vitest';
import { RecipeHttpController } from './recipe.controller';

const pancakes: RecipePreparation = {
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make('pancakes'),
  name: 'Pancakes',
  tips: [],
  basedOn: [],
  ingredients: [
    RecipeIngredient.make({
      uri: IngredientId.make('flour'),
      name: 'Flour',
      amount: Option.none(),
      optional: false,
      alternatives: [],
    }),
  ],
  portion: { kind: 'quantity', label: Option.none(), quantity: 4 },
  steps: [{ instruction: NonEmptyHtmlString.make('Mix and fry') }],
  stepsEnumerated: false,
  images: [],
};

const TestLayer = Layer.mergeAll(
  RecipeHttpController.pipe(
    Layer.provide(
      Layer.mock(RecipeQueries, {
        findById: ({ id }) =>
          id === pancakes.id
            ? Effect.succeed(pancakes)
            : Effect.fail(new RecipeNotFound({ id })),
      }),
    ),
  ),
  HttpServer.layerServices,
);

const run = <A, E>(
  effect: Effect.Effect<A, E, Layer.Success<typeof TestLayer> | Scope.Scope>,
) => Effect.runPromise(effect.pipe(Effect.provide(TestLayer), Effect.scoped));

describe('RecipeHttpController', () => {
  const makeClient = HttpApiTest.groups(OverckdApi, ['recipe']);

  it('finds a recipe by its id', async () => {
    const recipe = await run(
      Effect.gen(function* () {
        const client = yield* makeClient;
        return yield* client.recipe.findById({ params: { id: pancakes.id } });
      }),
    );
    expect(recipe).toEqual(pancakes);
  });

  it('answers unknown ids with a typed 404', async () => {
    const error = await run(
      Effect.gen(function* () {
        const client = yield* makeClient;
        return yield* client.recipe
          .findById({ params: { id: RecipeId.make('nope') } })
          .pipe(Effect.flip);
      }),
    );
    expect(error).toBeInstanceOf(RecipeNotFound);
  });
});
