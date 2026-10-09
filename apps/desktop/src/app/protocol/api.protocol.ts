import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { OverckdApi } from '@overckd/api-http';
import { CollectionHttpController } from '@overckd/collection/adapter-http-server';
import { CollectionQueriesLocal } from '@overckd/collection/application';
import { RecipeHttpController } from '@overckd/recipe/adapter-http-server';
import { RecipeQueriesLocal } from '@overckd/recipe/application';
import { Layer } from 'effect';
import { HttpRouter } from 'effect/http';
import { HttpApiBuilder } from 'effect/http-api';
import { app, protocol } from 'electron';
import { AppDirectory } from '../common/app-directory';
import { RepositoriesLive } from '../common/repositories';

/** The scheme of the API: the renderer calls `overckd://app/api/…` */
const scheme = 'overckd';

/**
 * The API as the backend serves it with `apiVersion: next`, on the files of
 * the app directory. The recipes link their images under `mediaUrl`.
 */
export const ApiLive = (mediaUrl: string) =>
  Layer.mergeAll(
    HttpApiBuilder.layer(OverckdApi).pipe(
      Layer.provide([CollectionHttpController, RecipeHttpController]),
    ),
    // The renderer runs on another origin (`http://localhost:4200`, `file://`)
    HttpRouter.cors(),
  ).pipe(
    Layer.provide([CollectionQueriesLocal, RecipeQueriesLocal]),
    Layer.provide(RepositoriesLive(mediaUrl)),
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

type ApiProtocolOptions = {
  /** The app directory (see `AppDirectory`), absolute */
  readonly appDirectory: string;
  /** Where clients reach the images of the recipes */
  readonly mediaUrl: string;
};

/**
 * Serves `ApiLive` over `overckd://` until the app quits. Call it once the
 * app is ready, after `registerApiScheme`.
 */
export const handleApiProtocol = ({
  appDirectory,
  mediaUrl,
}: ApiProtocolOptions): void => {
  const { handler, dispose } = HttpRouter.toWebHandler(
    ApiLive(mediaUrl).pipe(
      Layer.provide(AppDirectory.layer(appDirectory)),
      // Node and HTTP platform services, but no TCP server
      Layer.provide(NodeHttpServer.layerHttpServices),
    ),
  );
  protocol.handle(scheme, request => handler(request));
  app.on('will-quit', () => void dispose());
};
