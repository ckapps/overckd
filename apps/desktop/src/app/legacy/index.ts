import * as Fn from 'effect/Function';
import { app } from 'electron';
import {
  catchError,
  combineLatest,
  concatMap,
  defer,
  from,
  map,
  mergeMap,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { handleApiProtocol, registerApiScheme } from '../protocol/api.protocol';
import { serverMediaUrl, startServer } from '../server/server';
import { AppConfig, loadConfig } from './config';
import { ExitCode } from './exit-code.enum';
import { LogScope, scoped } from './logging';
import { parseArgs } from './process-args';

const appLog = scoped(LogScope.App);
const appEventLog = scoped(LogScope.AppEvent);

// ========================================================
// Parse command args
// ========================================================
const args = parseArgs(process.argv.slice(1));
appLog.info('starting overckd app');
appLog.debug('called with args', args);

/**
 * Creates the window
 */
// const createWindow = (): void => {
//   appLog.silly('createWindow');

//   const windowOptions: BrowserWindowConstructorOptions = {
//     height: 600,
//     width: 800,
//     titleBarStyle: 'hidden',
//     // titleBarStyle: 'hidden',
//     vibrancy: 'window', // 'light', 'medium-light' etc
//     backgroundColor: 'transparent',
//     // Best guess to make them vertically centered with the title bar
//     trafficLightPosition: { x: 12, y: 12 },
//   };

//   if (process.platform !== 'win32') {
//     // Set window icon for main window
//     windowOptions.icon = getPathFromSegments(PathId.AppAssets, [
//       'app-icon',
//       'png',
//       'app-icon-512.png',
//     ]);
//   }

//   // Create the browser window.
//   const mainWindow = new BrowserWindow(windowOptions);

//   // ----------------------------------------
//   // Startup for development
//   // ----------------------------------------
//   if (args.dev) {
//     mainWindow.webContents.openDevTools();

//     if (args.fromUrl) {
//       const windowUrl = 'http://localhost:4200';
//       appLog.info('loading main window from:', windowUrl);
//       mainWindow.loadURL(windowUrl);
//       return;
//     }
//   }

//   // ----------------------------------------
//   // Normal startup
//   // ----------------------------------------
//   const pathname = getPathFromSegments(PathId.AppAssets, [
//     'html',
//     'main',
//     'index.html',
//   ]);

//   appLog.info('loading main window from:', pathname);

//   mainWindow.loadURL(
//     url.format({
//       pathname,
//       protocol: 'file:',
//       slashes: true,
//     }),
//   );
// };

class AppInitError extends Error {
  constructor(
    public readonly exitCode: ExitCode,
    message: string,
    public readonly innerError?: Error,
  ) {
    super(message);
  }
}

/**
 * @param fromArgs App arguments
 *
 * @returns
 * An observable that emits with the resolved `AppConfig`.
 */
function initConfig$(fromArgs: typeof args): Observable<AppConfig> {
  return loadConfig(fromArgs.config).pipe(
    catchError(loadConfigError =>
      throwError(
        new AppInitError(
          ExitCode.ConfigFileInvalid,
          'could not parse config file',
          loadConfigError,
        ),
      ),
    ),
  );
}

/**
 * Serves the API over `overckd://`, from the files of the app directory. The
 * recipes link their images on the port of the server.
 *
 * @param config App configuration
 *
 * @returns
 * An observable that emits with `true`, when the protocol was initialized
 */
function startProtocol$(config: AppConfig): Observable<boolean> {
  return defer(() => {
    handleApiProtocol({
      appDirectory: config.paths.app,
      mediaUrl: serverMediaUrl(config.server.port),
    });
    return of(true);
  }).pipe(
    catchError(error =>
      throwError(
        () =>
          new AppInitError(
            ExitCode.ProtocolRegistrationFailed,
            'could not initialize protocols',
            error instanceof Error ? error : new Error(String(error)),
          ),
      ),
    ),
  );
}

/**
 * Serves the API on the port of the server config, from the files of the app
 * directory.
 *
 * @param config App configuration
 *
 * @returns
 * An observable that emits with `true`, when the server
 * was successfully initialized
 */
function startServer$(config: AppConfig): Observable<boolean> {
  return from(
    startServer({ port: config.server.port, appDirectory: config.paths.app }),
  ).pipe(
    map(() => true),
    catchError(error =>
      throwError(
        () =>
          new AppInitError(
            ExitCode.ServerStartFailed,
            'could not initialize server',
            error instanceof Error ? error : new Error(String(error)),
          ),
      ),
    ),
  );
}

/**
 * Initializes the application.
 *
 * @returns
 * An Observable that emits with `true` when initialization was successful.
 * If an error occurs, it will throw an `AppInitError`
 */
function stabilize$(fromArgs: typeof args): Observable<boolean> {
  return initConfig$(fromArgs).pipe(
    mergeMap(config =>
      combineLatest([startProtocol$(config), startServer$(config)]),
    ),
    map(() => true),
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// appIsStable$(() => stabilize$(args)).subscribe(
//   () => createWindow(),
//   // If some exit code was returned, terminate the app
//   (error: AppInitError) => {
//     appLog.error(error.message);
//     if (error.innerError) {
//       appLog.error(`${error.innerError.name}: ${error.innerError.message}`);
//     }
//     app.exit(error.exitCode);
//   },
// );

// Registers default behaviour middleware
// defaultAppBehaviour(createWindow).subscribe(() => {
//   appEventLog.debug('ran event handler');
// });

export function start() {
  // Must run before the app is ready
  registerApiScheme();

  from(app.whenReady())
    .pipe(concatMap(() => stabilize$(args)))
    .subscribe({
      next: Fn.constVoid,
      // If some exit code was returned, terminate the app
      error: (error: AppInitError) => {
        appLog.error(error.message);
        if (error.innerError) {
          appLog.error(`${error.innerError.name}: ${error.innerError.message}`);
        }
        app.exit(error.exitCode);
      },
    });
}
