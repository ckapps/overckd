import * as NodeServices from '@effect/platform-node/NodeServices';
import { Layer, ManagedRuntime } from 'effect';
import { app } from 'electron';
import { AppConfig } from './common/app.config';
import { AppDirectory } from './common/app-directory';
import { ConfigLive } from './common/config';
import { ElectronPaths } from './common/electron-paths';
import { LoggingLive } from './common/logging';
import { ApiProtocolLive, registerApiScheme } from './protocol/api.protocol';

/**
 * The main process: the API over `overckd://` on the app directory of the
 * config, logging to the console and a file.
 */
const MainLive = ApiProtocolLive.pipe(
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
 * quits. An invalid config stops the app.
 */
export function start() {
  // Must run before the app is ready
  registerApiScheme();

  const runtime = ManagedRuntime.make(MainLive);
  app.on('will-quit', () => void runtime.dispose());

  app
    .whenReady()
    .then(() => runtime.context())
    .catch((error: unknown) => {
      console.error(
        'overckd could not start:',
        error instanceof Error ? error.message : String(error),
      );
      app.exit(1);
    });
}
