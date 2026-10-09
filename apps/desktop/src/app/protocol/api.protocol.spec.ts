import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { CollectionQueriesHttp } from '@overckd/collection/adapter-http-client';
import { CollectionQueries } from '@overckd/collection/application';
import { CollectionId, CollectionNotFound, RecipeId } from '@overckd/domain';
import { RecipeQueriesHttp } from '@overckd/recipe/adapter-http-client';
import { RecipeQueries } from '@overckd/recipe/application';
import { Effect, Layer, Logger, Path } from 'effect';
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpRouter,
} from 'effect/http';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppDirectory } from '../common/app-directory';
import { ApiLive, apiHandler } from './api.protocol';

const pancakesFile = `overckd: 1.0.0
recipe:
  name: Pancakes
  ingredients:
    - name: Flour
  steps:
    - Mix and fry
  tips: []
  images:
    - /images/pancakes.jpeg
  styles: {}
`;

const collectionsFile = `overckd: 1.0.0
collections:
  - &sweet
    id: sweet
    name: Sweets
    description: Something sweet
recipes:
  pancakes:
    name: Pancakes
    uri: overckd://localhost
    collections:
      - *sweet
`;

let dir: string;
let handler: (request: Request) => Promise<Response>;
let dispose: () => Promise<void>;

/** `ApiLive` on an app directory with one recipe, one collection and one image */
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'overckd-app-'));
  await mkdir(join(dir, 'recipes'));
  await mkdir(join(dir, 'images'));
  await writeFile(join(dir, 'recipes', 'pancakes.recipe.yaml'), pancakesFile);
  await writeFile(join(dir, 'overckd.collections.yaml'), collectionsFile);
  await writeFile(join(dir, 'images', 'pancakes.jpeg'), 'jpeg bytes');

  ({ handler, dispose } = HttpRouter.toWebHandler(
    ApiLive.pipe(
      Layer.provide(AppDirectory.layer(dir)),
      Layer.provide(NodeHttpServer.layerHttpServices),
    ),
    { disableLogger: true },
  ));
});

afterAll(async () => {
  await dispose();
  await rm(dir, { recursive: true, force: true });
});

const get = (path: string, headers?: HeadersInit) =>
  handler(new Request(`overckd://app${path}`, { headers }));

describe('ApiLive', () => {
  it('answers the collections of the collections file', async () => {
    const response = await get('/api/collections');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      {
        id: 'sweet',
        name: 'Sweets',
        description: 'Something sweet',
        recipes: [{ id: 'Pancakes', name: 'Pancakes' }],
      },
    ]);
  });

  it('answers a recipe in the JSON of OverckdApi, linking its images under overckd://app/images', async () => {
    const response = await get('/api/recipes/Pancakes');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      _tag: 'BasicRecipePreparation',
      id: 'Pancakes',
      name: 'Pancakes',
      steps: [{ instruction: 'Mix and fry' }],
      images: ['overckd://app/images/pancakes.jpeg'],
    });
  });

  it('answers an unknown recipe with a typed 404', async () => {
    const response = await get('/api/recipes/Waffles');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      _tag: 'RecipeNotFound',
      id: 'Waffles',
    });
  });

  it('allows calls from the renderer origin', async () => {
    const response = await get('/api/collections', {
      origin: 'http://localhost:4200',
    });

    expect(response.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('serves the images of the app directory', async () => {
    const response = await get('/images/pancakes.jpeg');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');
    expect(response.headers.get('cache-control')).toBe('no-cache');
    expect(await response.text()).toBe('jpeg bytes');
  });

  it('answers an unknown image with a 404', async () => {
    const response = await get('/images/waffles.jpeg');

    expect(response.status).toBe(404);
  });
});

describe('the renderer clients over overckd://', () => {
  /** The renderer's HttpClient, with `fetch` answered by the protocol */
  const RendererHttpClient = Layer.effect(
    HttpClient.HttpClient,
    Effect.map(
      HttpClient.HttpClient,
      HttpClient.mapRequest(HttpClientRequest.prependUrl('overckd://app')),
    ),
  ).pipe(Layer.provide(FetchHttpClient.layer));

  const run = <A, E>(
    effect: Effect.Effect<A, E, CollectionQueries | RecipeQueries>,
  ) =>
    Effect.runPromise(
      effect.pipe(
        Effect.provide(
          Layer.mergeAll(CollectionQueriesHttp, RecipeQueriesHttp).pipe(
            Layer.provide(RendererHttpClient),
          ),
        ),
        Effect.provideService(FetchHttpClient.Fetch, (input, init) =>
          handler(new Request(input, init)),
        ),
      ),
    );

  it('get the collections', async () => {
    const collections = await run(
      CollectionQueries.use(queries => queries.getAll),
    );

    expect(collections.map(collection => collection.name)).toEqual(['Sweets']);
  });

  it('get a recipe', async () => {
    const recipe = await run(
      RecipeQueries.use(queries =>
        queries.findById({ id: RecipeId.make('Pancakes') }),
      ),
    );

    expect(recipe.name).toBe('Pancakes');
    expect(recipe.images).toEqual(['overckd://app/images/pancakes.jpeg']);
  });

  it('keep the typed error of an unknown collection', async () => {
    const error = await run(
      CollectionQueries.use(queries =>
        queries.findById({ id: CollectionId.make('salty') }),
      ).pipe(Effect.flip),
    );

    expect(error).toBeInstanceOf(CollectionNotFound);
  });
});

describe('apiHandler', () => {
  it('logs the requests with the given loggers', async () => {
    const messages: Array<string> = [];
    const logger = Logger.make(({ message }) => {
      messages.push(String(message));
    });
    const appDirectory = await Effect.runPromise(
      AppDirectory.useSync(appDirectory => appDirectory).pipe(
        Effect.provide(AppDirectory.layer(dir).pipe(Layer.provide(Path.layer))),
      ),
    );
    const api = apiHandler(appDirectory, new Set([logger]));

    try {
      await api.handler(new Request('overckd://app/api/collections'));
    } finally {
      await api.dispose();
    }

    expect(messages.join('\n')).toContain('Sent HTTP response');
  });
});
