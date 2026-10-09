import * as NodeServices from '@effect/platform-node/NodeServices';
import { Layer, ManagedRuntime } from 'effect';
import { app } from 'electron';
import { join } from 'node:path';
import { AppConfig } from './common/app.config';
import { AppDirectory } from './common/app-directory';
import { ConfigLive } from './common/config';
import { ElectronPaths } from './common/electron-paths';
import { LoggingLive } from './common/logging';
import { rendererAppName } from './constants';
import { ApiProtocolLive } from './protocol/api.protocol';
import { RendererProtocolLive } from './protocol/renderer.protocol';
import { registerSchemes } from './protocol/schemes';

/**
 * The protocols: the API over `overckd://` on the app directory of the
 * config, and in the packaged app the renderer over `overckd-app://`. In
 * development the renderer comes from its dev server.
 */
const ProtocolsLive = app.isPackaged
  ? Layer.mergeAll(
      ApiProtocolLive,
      // The renderer's files lie next to the main process' folder
      RendererProtocolLive(join(__dirname, '..', rendererAppName)),
    )
  : ApiProtocolLive;

/** The main process, logging to the console and a file. */
const MainLive = ProtocolsLive.pipe(
  Layer.provide(AppDirectory.layerConfig),
  Layer.provide(AppConfig.layer),
  Layer.provideMerge(LoggingLive),
  // After the sections, so they read the config
  Layer.provide(ConfigLive),
  Layer.provide(ElectronPaths.layer),
  Layer.provide(NodeServices.layer),
);

/**
 * Starts the main process once the app is ready, and stops it when the app
 * quits. Resolves when the protocols are served; an invalid config stops the
 * app.
 */
export function start(): Promise<void> {
  // Must run before the app is ready
  registerSchemes();

  const runtime = ManagedRuntime.make(MainLive);
  app.on('will-quit', () => void runtime.dispose());

  return app
    .whenReady()
    .then(() => runtime.context())
    .then(
      () => undefined,
      (error: unknown) => {
        console.error(
          'overckd could not start:',
          error instanceof Error ? error.message : String(error),
        );
        app.exit(1);
        throw error;
      },
    );
}
