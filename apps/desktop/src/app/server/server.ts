import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import {
  CollectionLegacyHttpController,
  OverckdLegacyApi,
  RecipeLegacyHttpController,
} from '@overckd/adapter-http-server-legacy';
import {
  CollectionRepoFs,
  CollectionRepoFsConfig,
} from '@overckd/collection/adapter-fs';
import { CollectionQueriesLocal } from '@overckd/collection/application';
import { RecipeRepoFs, RecipeRepoFsConfig } from '@overckd/recipe/adapter-fs';
import { RecipeQueriesLocal } from '@overckd/recipe/application';
import { Layer, ManagedRuntime } from 'effect';
import { HttpRouter, HttpStaticServer } from 'effect/http';
import { HttpApiBuilder } from 'effect/http-api';
import { app } from 'electron';
import { createServer } from 'node:http';
import { AppDirectory } from '../common/app-directory';

/** The URL path of the images, where the recipe files link them */
const mediaPath = '/images';

/**
 * File repositories on the app directory, which read the files on every call.
 * The recipes link their images under `mediaUrl`.
 */
const RepositoriesLive = (mediaUrl: string) =>
  Layer.mergeAll(
    RecipeRepoFs.pipe(
      Layer.provide(
        Layer.effect(
          RecipeRepoFsConfig,
          AppDirectory.useSync(({ recipes }) =>
            RecipeRepoFsConfig.of({ dir: recipes, codec: 'yaml', mediaUrl }),
          ),
        ),
      ),
    ),
    CollectionRepoFs.pipe(
      Layer.provide(
        Layer.effect(
          CollectionRepoFsConfig,
          AppDirectory.useSync(({ collectionsFile }) =>
            CollectionRepoFsConfig.of({ file: collectionsFile, codec: 'yaml' }),
          ),
        ),
      ),
    ),
  );

/** The images of the app directory under `mediaPath` */
const MediaLive = Layer.unwrap(
  AppDirectory.useSync(({ images }) =>
    HttpStaticServer.layer({
      root: images,
      prefix: mediaPath,
      // No index file: a directory is not a medium
      index: undefined,
      // A file can be replaced under its name, so caches revalidate with the
      // ETag
      cacheControl: 'no-cache',
    }),
  ),
);

/**
 * The API of the legacy frontend, as the backend serves it with
 * `apiVersion: legacy`, and the images, on the files of the app directory.
 * Clients reach the server at `origin`.
 */
export const HttpAppLive = (origin: string) =>
  Layer.mergeAll(
    HttpApiBuilder.layer(OverckdLegacyApi).pipe(
      Layer.provide([
        CollectionLegacyHttpController,
        RecipeLegacyHttpController,
      ]),
    ),
    MediaLive,
    HttpRouter.cors(),
  ).pipe(
    Layer.provide([CollectionQueriesLocal, RecipeQueriesLocal]),
    Layer.provide(RepositoriesLive(`${origin}${mediaPath}`)),
  );

type ServerOptions = {
  /** The port to listen on */
  readonly port: number;
  /** The app directory (see `AppDirectory`), absolute */
  readonly appDirectory: string;
};

/**
 * Serves `HttpAppLive` on `localhost:<port>` until the app quits. Resolves
 * once the server listens.
 */
export const startServer = async ({
  port,
  appDirectory,
}: ServerOptions): Promise<void> => {
  const runtime = ManagedRuntime.make(
    // `HttpRouter.serve` applies the request logger and logs the server address
    HttpRouter.serve(HttpAppLive(`http://localhost:${port}`)).pipe(
      Layer.provide(AppDirectory.layer(appDirectory)),
      Layer.provide(NodeHttpServer.layer(createServer, { port })),
    ),
  );
  app.on('will-quit', () => void runtime.dispose());
  await runtime.context();
};
