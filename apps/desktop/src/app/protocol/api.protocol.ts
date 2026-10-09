import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { OverckdApi } from '@overckd/api-http';
import { CollectionHttpController } from '@overckd/collection/adapter-http-server';
import { CollectionQueriesLocal } from '@overckd/collection/application';
import { RecipeHttpController } from '@overckd/recipe/adapter-http-server';
import { RecipeQueriesLocal } from '@overckd/recipe/application';
import { Effect, Layer, Logger } from 'effect';
import { HttpRouter, HttpStaticServer } from 'effect/http';
import { HttpApiBuilder } from 'effect/http-api';
import { protocol } from 'electron';
import { AppDirectory } from '../common/app-directory';
import { RepositoriesLive } from '../common/repositories';

/** The scheme of the API: the renderer calls `overckd://app/api/…` */
const scheme = 'overckd';

/** Where clients reach the API and its media */
export const apiOrigin = `${scheme}://app`;

/** The URL path of the images, where the recipe files link them */
const mediaPath = '/images';

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
 * The API as the backend serves it with `apiVersion: next`, and the images,
 * on the files of the app directory. The recipes link their images under
 * `overckd://app/images`.
 */
export const ApiLive = Layer.mergeAll(
  HttpApiBuilder.layer(OverckdApi).pipe(
    Layer.provide([CollectionHttpController, RecipeHttpController]),
  ),
  MediaLive,
  // The renderer runs on another origin (`http://localhost:4200`, `file://`)
  HttpRouter.cors(),
).pipe(
  Layer.provide([CollectionQueriesLocal, RecipeQueriesLocal]),
  Layer.provide(RepositoriesLive(`${apiOrigin}${mediaPath}`)),
);

/**
 * Registers the scheme of the API. Must run before the app is ready.
 *
 * `standard` parses `overckd://app/api/…` like an http URL, `secure` makes it
 * a secure context, `supportFetchAPI` allows `fetch`, and `corsEnabled`
 * allows the calls from the renderer's origin.
 */
export const registerApiScheme = () =>
  protocol.registerSchemesAsPrivileged([
    {
      scheme,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ]);

/**
 * `ApiLive` as a Fetch handler on the given app directory. It runs on a
 * runtime of its own, which logs with the given `loggers`.
 */
export const apiHandler = (
  appDirectory: AppDirectory['Service'],
  loggers: ReadonlySet<Logger.Logger<unknown, unknown>>,
) =>
  HttpRouter.toWebHandler(
    ApiLive.pipe(
      Layer.provide(Layer.succeed(AppDirectory, appDirectory)),
      // Node and HTTP platform services, but no TCP server
      Layer.provide(NodeHttpServer.layerHttpServices),
      // Merged, so the handler's requests log with them too
      Layer.provideMerge(Layer.succeed(Logger.CurrentLoggers, loggers)),
    ),
  );

/**
 * Serves `ApiLive` over `overckd://` while the layer lives, logging like the
 * app. Build it once the app is ready, after `registerApiScheme`.
 */
export const ApiProtocolLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const appDirectory = yield* AppDirectory;
    const { handler, dispose } = apiHandler(
      appDirectory,
      yield* Logger.CurrentLoggers,
    );

    protocol.handle(scheme, request => handler(request));
    yield* Effect.addFinalizer(() =>
      Effect.promise(() => {
        protocol.unhandle(scheme);
        return dispose();
      }),
    );
    yield* Effect.logInfo(`Serving ${apiOrigin}`, appDirectory);
  }),
);
