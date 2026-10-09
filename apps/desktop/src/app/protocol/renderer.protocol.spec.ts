import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { rendererHandler } from './renderer.protocol';

let dir: string;
let handler: (request: Request) => Promise<Response>;
let dispose: () => Promise<void>;

/** `rendererHandler` on a renderer build with an index and a script */
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'overckd-renderer-'));
  await mkdir(join(dir, 'frontend'));
  await writeFile(join(dir, 'frontend', 'index.html'), '<app-root></app-root>');
  await writeFile(join(dir, 'frontend', 'main.js'), 'bootstrap()');
  await writeFile(join(dir, 'secret.txt'), 'secret');

  ({ handler, dispose } = rendererHandler(join(dir, 'frontend')));
});

afterAll(async () => {
  await dispose();
  await rm(dir, { recursive: true, force: true });
});

const get = (path: string, headers?: HeadersInit) =>
  handler(new Request(`overckd-app://app${path}`, { headers }));

describe('rendererHandler', () => {
  it('answers the index at the root', async () => {
    const response = await get('/');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('<app-root></app-root>');
  });

  it('answers the files of the renderer', async () => {
    const response = await get('/main.js');

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('javascript');
    expect(await response.text()).toBe('bootstrap()');
  });

  it('answers a navigation to a route of the renderer with the index', async () => {
    const response = await get('/recipes/recipe/Pancakes', {
      accept: 'text/html',
    });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('<app-root></app-root>');
  });

  it('answers a missing file with a 404', async () => {
    const response = await get('/missing.js');

    expect(response.status).toBe(404);
  });

  it('serves nothing outside the renderer', async () => {
    const response = await get('/../secret.txt');

    expect(await response.text()).not.toBe('secret');
  });
});
