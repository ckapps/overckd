import { CollectionQueries } from '@overckd/collection/application';
import {
  Collection,
  CollectionId,
  CollectionNotFound,
  RecipeId,
  RecipeRef,
} from '@overckd/domain-experimental';
import { Cause, Effect, Exit, Layer } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';
import { describe, expect, it } from 'vitest';
import { CollectionQueriesHttp } from './collection-queries.http';

const desserts = Collection.make({
  id: CollectionId.make('desserts'),
  name: 'Desserts',
  description: 'Sweet things',
  recipes: [
    RecipeRef.make({ id: RecipeId.make('Tiramisu'), name: 'Tiramisu' }),
  ],
});

const dessertsJson = {
  id: 'desserts',
  name: 'Desserts',
  description: 'Sweet things',
  recipes: [{ id: 'Tiramisu', name: 'Tiramisu' }],
};

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

const run = <A, E>(
  effect: Effect.Effect<A, E, CollectionQueries>,
  fetch: typeof globalThis.fetch,
) =>
  effect.pipe(
    Effect.provide(CollectionQueriesHttp.pipe(Layer.provide(TestHttpClient))),
    Effect.provideService(FetchHttpClient.Fetch, fetch),
  );

const getAll = CollectionQueries.use(queries => queries.getAll);

const findById = (id: string) =>
  CollectionQueries.use(queries =>
    queries.findById({ id: CollectionId.make(id) }),
  );

const isDefect = (exit: Exit.Exit<unknown, unknown>) =>
  Exit.isFailure(exit) && Cause.hasDies(exit.cause);

describe('CollectionQueriesHttp', () => {
  describe('getAll', () => {
    it('gets the collections from the API', async () => {
      const { fetch, requests } = respondWith(200, [dessertsJson]);
      const collections = await Effect.runPromise(run(getAll, fetch));
      expect(collections).toEqual([desserts]);
      expect(requests).toEqual(['http://api.test/api/collections']);
    });

    it('turns transport failures into defects', async () => {
      const exit = await Effect.runPromiseExit(run(getAll, offline));
      expect(isDefect(exit)).toBe(true);
    });

    it('turns undecodable answers into defects', async () => {
      const { fetch } = respondWith(200, [{ id: 'desserts' }]);
      const exit = await Effect.runPromiseExit(run(getAll, fetch));
      expect(isDefect(exit)).toBe(true);
    });
  });

  describe('findById', () => {
    it('gets the collection from the API', async () => {
      const { fetch, requests } = respondWith(200, dessertsJson);
      const collection = await Effect.runPromise(
        run(findById('desserts'), fetch),
      );
      expect(collection).toEqual(desserts);
      expect(requests).toEqual(['http://api.test/api/collections/desserts']);
    });

    it('keeps the typed domain error', async () => {
      const { fetch } = respondWith(404, {
        _tag: 'CollectionNotFound',
        id: 'nope',
      });
      const error = await Effect.runPromise(
        run(findById('nope'), fetch).pipe(Effect.flip),
      );
      expect(error).toBeInstanceOf(CollectionNotFound);
      expect(error.id).toBe('nope');
    });

    it('turns transport failures into defects', async () => {
      const exit = await Effect.runPromiseExit(
        run(findById('desserts'), offline),
      );
      expect(isDefect(exit)).toBe(true);
    });

    it('turns status codes the contract does not declare into defects', async () => {
      const { fetch } = respondWith(500, { message: 'boom' });
      const exit = await Effect.runPromiseExit(
        run(findById('desserts'), fetch),
      );
      expect(isDefect(exit)).toBe(true);
    });
  });
});
