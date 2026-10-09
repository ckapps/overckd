import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { Effect, Layer } from 'effect';
import { HttpRouter, HttpStaticServer } from 'effect/http';
import { protocol } from 'electron';
import { rendererScheme } from './schemes';

/** Where the packaged window loads the renderer */
export const rendererOrigin = `${rendererScheme}://app`;

/** The renderer's files in `root`, with its `index.html` for every route */
export const RendererLive = (root: string) =>
  HttpStaticServer.layer({ root, index: 'index.html', spa: true });

/** `RendererLive` as a Fetch handler, without request logs */
export const rendererHandler = (root: string) =>
  HttpRouter.toWebHandler(
    RendererLive(root).pipe(
      // Node and HTTP platform services, but no TCP server
      Layer.provide(NodeHttpServer.layerHttpServices),
    ),
    { disableLogger: true },
  );

/**
 * Serves the renderer's files in `root` over `overckd-app://` while the layer
 * lives. Build it once the app is ready, after `registerSchemes`.
 */
export const RendererProtocolLive = (root: string) =>
  Layer.effectDiscard(
    Effect.gen(function* () {
      const { handler, dispose } = rendererHandler(root);

      protocol.handle(rendererScheme, request => handler(request));
      yield* Effect.addFinalizer(() =>
        Effect.promise(() => {
          protocol.unhandle(rendererScheme);
          return dispose();
        }),
      );
      yield* Effect.logInfo(`Serving ${rendererOrigin}`, root);
    }),
  );
