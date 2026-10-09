import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { Layer } from 'effect';
import { HttpRouter } from 'effect/http';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppDirectory } from '../common/app-directory';
import { HttpAppLive } from './server';

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

/** An app directory with one recipe, one collection and one image */
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'overckd-app-'));
  await mkdir(join(dir, 'recipes'));
  await mkdir(join(dir, 'images'));
  await writeFile(join(dir, 'recipes', 'pancakes.recipe.yaml'), pancakesFile);
  await writeFile(join(dir, 'overckd.collections.yaml'), collectionsFile);
  await writeFile(join(dir, 'images', 'pancakes.jpeg'), 'jpeg bytes');
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

/** Answers `path` with `HttpAppLive` on the app directory */
const get = async (path: string) => {
  const { handler, dispose } = HttpRouter.toWebHandler(
    HttpAppLive('http://localhost:3000').pipe(
      Layer.provide(AppDirectory.layer(dir)),
      Layer.provide(NodeHttpServer.layerHttpServices),
    ),
    { disableLogger: true },
  );
  try {
    return await handler(new Request(`http://localhost${path}`));
  } finally {
    await dispose();
  }
};

describe('HttpAppLive', () => {
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

  it('answers a recipe in the JSON of OverckdApi, linking its images under the origin', async () => {
    const response = await get('/api/recipes/Pancakes');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      _tag: 'BasicRecipePreparation',
      id: 'Pancakes',
      name: 'Pancakes',
      steps: [{ instruction: 'Mix and fry' }],
      ingredients: [{ name: 'Flour' }],
      images: ['http://localhost:3000/images/pancakes.jpeg'],
    });
  });

  it('answers 404 for an unknown recipe', async () => {
    const response = await get('/api/recipes/Waffles');

    expect(response.status).toBe(404);
  });

  it('serves the images of the app directory', async () => {
    const response = await get('/images/pancakes.jpeg');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');
    expect(response.headers.get('cache-control')).toBe('no-cache');
    expect(await response.text()).toBe('jpeg bytes');
  });
});
