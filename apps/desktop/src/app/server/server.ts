import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { OverckdApi } from '@overckd/api-http';
import { CollectionHttpController } from '@overckd/collection/adapter-http-server';
import { CollectionQueriesLocal } from '@overckd/collection/application';
import { RecipeHttpController } from '@overckd/recipe/adapter-http-server';
import { RecipeQueriesLocal } from '@overckd/recipe/application';
import { Layer, ManagedRuntime } from 'effect';
import { HttpRouter, HttpStaticServer } from 'effect/http';
import { HttpApiBuilder } from 'effect/http-api';
import { app } from 'electron';
import { createServer } from 'node:http';
import { AppDirectory } from '../common/app-directory';
import { RepositoriesLive } from '../common/repositories';

/** The URL path of the images, where the recipe files link them */
const mediaPath = '/images';

/** Where clients reach the server on `port` */
const serverOrigin = (port: number) => `http://localhost:${port}`;

/** Where clients reach the images of the server on `port` */
export const serverMediaUrl = (port: number) =>
  `${serverOrigin(port)}${mediaPath}`;

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
 * The API, as the backend serves it with `apiVersion: next`, and the images,
 * on the files of the app directory. Clients reach the server at `origin`.
 */
export const HttpAppLive = (origin: string) =>
  Layer.mergeAll(
    HttpApiBuilder.layer(OverckdApi).pipe(
      Layer.provide([CollectionHttpController, RecipeHttpController]),
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
    HttpRouter.serve(HttpAppLive(serverOrigin(port))).pipe(
      Layer.provide(AppDirectory.layer(appDirectory)),
      Layer.provide(NodeHttpServer.layer(createServer, { port })),
    ),
  );
  app.on('will-quit', () => void runtime.dispose());
  await runtime.context();
};
