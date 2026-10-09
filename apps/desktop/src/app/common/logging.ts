import { Effect, FileSystem, Layer, Logger, Path } from 'effect';
import { ElectronPaths } from './electron-paths';

/** The name of the log file in Electron's logs directory */
export const logFileName = 'main.log';

/** Logs to the console, and to `main.log` in Electron's logs directory */
export const LoggingLive = Layer.unwrap(
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;
    const { logs } = yield* ElectronPaths;
    yield* fs.makeDirectory(logs, { recursive: true });

    return Logger.layer([
      Logger.consolePretty(),
      Logger.toFile(Logger.formatSimple, path.join(logs, logFileName)),
    ]);
  }),
);
