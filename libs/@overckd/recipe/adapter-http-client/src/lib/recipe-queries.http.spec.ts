import {
  IngredientId,
  NonEmptyHtmlString,
  RecipeId,
  RecipeIngredient,
  RecipeNotFound,
  RecipePreparation,
  RecipePreparationJson,
} from '@overckd/domain-experimental';
import { RecipeQueries } from '@overckd/recipe/application';
import { Cause, Effect, Exit, Layer, Option, Schema } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';
import { describe, expect, it } from 'vitest';
import { RecipeQueriesHttp } from './recipe-queries.http';

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
  images: ['http://media.test/images/pancakes.jpeg'],
};

const pancakesJson = Schema.encodeSync(RecipePreparationJson)(pancakes);

/** A fetch that answers every request with `body` and records the URLs. */
const respondWith = (status: number, body: unknown) => {
  const requests: Array<string> = [];
  const fetch: typeof globalThis.fetch = input => {
    requests.push(input instanceof Request ? input.url : String(input));
    return Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
    );
  };
  return { fetch, requests };
};

const offline: typeof globalThis.fetch = () =>
  Promise.reject(new TypeError('Failed to fetch'));

// Node has no `location`, so the client needs an absolute base URL.
const TestHttpClient = Layer.effect(
  HttpClient.HttpClient,
  Effect.map(
    HttpClient.HttpClient,
    HttpClient.mapRequest(HttpClientRequest.prependUrl('http://api.test')),
  ),
).pipe(Layer.provide(FetchHttpClient.layer));

const findById = (id: string, fetch: typeof globalThis.fetch) =>
  RecipeQueries.use(queries =>
    queries.findById({ id: RecipeId.make(id) }),
  ).pipe(
    Effect.provide(RecipeQueriesHttp.pipe(Layer.provide(TestHttpClient))),
    Effect.provideService(FetchHttpClient.Fetch, fetch),
  );

const isDefect = (exit: Exit.Exit<unknown, unknown>) =>
  Exit.isFailure(exit) && Cause.hasDies(exit.cause);

describe('RecipeQueriesHttp', () => {
  describe('findById', () => {
    it('gets the recipe from the API', async () => {
      const { fetch, requests } = respondWith(200, pancakesJson);
      const recipe = await Effect.runPromise(findById('Pancakes', fetch));
      expect(recipe).toEqual(pancakes);
      expect(requests).toEqual(['http://api.test/api/recipes/Pancakes']);
    });

    it('encodes the id in the URL', async () => {
      const { fetch, requests } = respondWith(200, {
        ...pancakesJson,
        id: 'Recipe 1',
      });
      await Effect.runPromise(findById('Recipe 1', fetch));
      expect(requests).toEqual(['http://api.test/api/recipes/Recipe%201']);
    });

    it('keeps the typed domain error', async () => {
      const { fetch } = respondWith(404, {
        _tag: 'RecipeNotFound',
        id: 'nope',
      });
      const error = await Effect.runPromise(
        findById('nope', fetch).pipe(Effect.flip),
      );
      expect(error).toBeInstanceOf(RecipeNotFound);
      expect(error.id).toBe('nope');
    });

    it('turns transport failures into defects', async () => {
      const exit = await Effect.runPromiseExit(findById('Pancakes', offline));
      expect(isDefect(exit)).toBe(true);
    });

    it('turns status codes the contract does not declare into defects', async () => {
      const { fetch } = respondWith(500, { message: 'boom' });
      const exit = await Effect.runPromiseExit(findById('Pancakes', fetch));
      expect(isDefect(exit)).toBe(true);
    });

    it('turns undecodable answers into defects', async () => {
      const { fetch } = respondWith(200, { id: 'Pancakes', name: 'Pancakes' });
      const exit = await Effect.runPromiseExit(findById('Pancakes', fetch));
      expect(isDefect(exit)).toBe(true);
    });
  });
});
