import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { Layer } from 'effect';
import { HttpRouter } from 'effect/http';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { MediaLive } from './media';
import { FullMediaConfig, MediaConfig } from './media.config';

const origin = 'http://localhost:3000';
let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'overckd-media-'));
  await writeFile(join(dir, 'recipe-1.jpeg'), 'jpeg bytes');
});

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

/** Answers `path` with the media route of `config` */
const get = async (config: FullMediaConfig, path: string) => {
  const { handler, dispose } = HttpRouter.toWebHandler(
    MediaLive.pipe(
      Layer.provide(Layer.succeed(MediaConfig, MediaConfig.of(config))),
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

describe('MediaLive', () => {
  it('serves the files of a filesystem dir under its path', async () => {
    const response = await get(
      { type: 'filesystem', dir, path: '/images', origin },
      '/images/recipe-1.jpeg',
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/jpeg');
    expect(response.headers.get('cache-control')).toBe('no-cache');
    expect(await response.text()).toBe('jpeg bytes');
  });

  it('answers 404 for a file the dir lacks', async () => {
    const response = await get(
      { type: 'filesystem', dir, path: '/media', origin },
      '/media/missing.jpeg',
    );

    expect(response.status).toBe(404);
  });

  it('answers 404 for a path that leaves the dir', async () => {
    const response = await get(
      { type: 'filesystem', dir, path: '/media', origin },
      '/media/..%2Fpasswd',
    );

    expect(response.status).toBe(404);
  });

  it('serves nothing outside its path', async () => {
    const response = await get(
      { type: 'filesystem', dir, path: '/images', origin },
      '/media/recipe-1.jpeg',
    );

    expect(response.status).toBe(404);
  });

  it('serves no media for none', async () => {
    const response = await get({ type: 'none' }, '/media/recipe-1.jpeg');

    expect(response.status).toBe(404);
  });
});
