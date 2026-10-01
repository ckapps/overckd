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
import { OverckdLegacyApi } from './overckd-legacy.api';
import { RecipeLegacyHttpController } from './recipe-legacy.controller';

const pancakes: RecipePreparation = {
  _tag: 'BasicRecipePreparation',
  id: RecipeId.make('Pancakes'),
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
  RecipeLegacyHttpController.pipe(
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

describe('RecipeLegacyHttpController', () => {
  const makeClient = HttpApiTest.groups(OverckdLegacyApi, ['recipe']);

  it('answers with the JSON of the legacy recipe page', async () => {
    const json = await run(
      Effect.gen(function* () {
        const client = yield* makeClient;
        const response = yield* client.recipe.findById({
          params: { id: pancakes.id },
          responseMode: 'response-only',
        });
        return yield* response.json;
      }),
    );
    expect(json).toStrictEqual({
      id: 'Pancakes',
      name: 'Pancakes',
      portion: { kind: 'quantity', count: 4 },
      ingredients: [{ name: 'Flour' }],
      steps: ['Mix and fry'],
      tips: [],
      images: [],
      styles: {},
    });
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
