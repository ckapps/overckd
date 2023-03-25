import { appIsStable$, fromAppEvent } from '@ckapp/rxjs-electron/lib/app';
import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as url from 'url';
import { of, throwError, Observable, combineLatest, merge } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { initProtocols } from './protocol';
import { initServer } from './server';
import { ExitCode } from './exit-code.enum';
import { AppConfig, loadConfig } from './config';

import { defaultAppBehaviour } from './app/app.behaviour';
import { configureDeps } from './configure-dependencies';
import { LogScope, scoped } from './logging';
import { getPathFromSegments, PathId } from './paths';
import { parseArgs } from './process-args';

const appLog = scoped(LogScope.App);
const appEventLog = scoped(LogScope.AppEvent);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  appLog.info('creating/removing shortcuts on windows. Quitting...');
  app.quit();
}

// ========================================================
// Parse command args
// ========================================================
const args = parseArgs(process.argv.slice(1));
appLog.info('starting overckd app');
appLog.debug('called with args', args);

/**
 * Creates the window
 */
const createWindow = (): void => {
  appLog.silly('createWindow');

  const windowOptions: BrowserWindowConstructorOptions = {
    height: 600,
    width: 800,
    titleBarStyle: 'hidden',
    // titleBarStyle: 'hidden',
    vibrancy: 'window', // 'light', 'medium-light' etc
    backgroundColor: 'transparent',
  };

  if (process.platform !== 'win32') {
    // Set window icon for main window
    windowOptions.icon = getPathFromSegments(PathId.AppAssets, [
      'app-icon',
      'png',
      'app-icon-512.png',
    ]);
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow(windowOptions);

  // ----------------------------------------
  // Startup for development
  // ----------------------------------------
  if (args.dev) {
    mainWindow.webContents.openDevTools();

    if (args.fromUrl) {
      const windowUrl = 'http://localhost:4200';
      appLog.info('loading main window from:', windowUrl);
      mainWindow.loadURL(windowUrl);
      return;
    }
  }

  // ----------------------------------------
  // Normal startup
  // ----------------------------------------
  const pathname = getPathFromSegments(PathId.AppAssets, [
    'html',
    'main',
    'index.html',
  ]);

  appLog.info('loading main window from:', pathname);

  mainWindow.loadURL(
    url.format({
      pathname,
      protocol: 'file:',
      slashes: true,
    }),
  );
};

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
 * @returns
 * An observable that emits with `true`, when the protocols where
 * initialized
 */
function initProtocols$(): Observable<boolean> {
  return of(initProtocols()).pipe(
    map(initialized => {
      if (!initialized) {
        throw new AppInitError(
          ExitCode.ProtocolRegistrationFailed,
          'could not initialize protocols',
        );
      }
      return true;
    }),
  );
}

/**
 *
 * @param config App configuration
 *
 * @returns
 * An observable that emits with `true`, when the server
 * was successfully initialized
 */
function startServer$(config: AppConfig): Observable<boolean> {
  return initServer(config.server, configureDeps()).pipe(
    map(initialized => {
      if (!initialized) {
        throw new AppInitError(
          ExitCode.ServerStartFailed,
          'could not initialize server',
        );
      }
      return true;
    }),
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
  return combineLatest([initConfig$(fromArgs), initProtocols$()]).pipe(
    map(([appConfig]) => appConfig),
    mergeMap(config => startServer$(config)),
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
appIsStable$(() => stabilize$(args)).subscribe(
  () => createWindow(),
  // If some exit code was returned, terminate the app
  (error: AppInitError) => {
    appLog.error(error.message);
    if (error.innerError) {
      appLog.error(`${error.innerError.name}: ${error.innerError.message}`);
    }
    app.exit(error.exitCode);
  },
);

// Registers default behaviour middleware
defaultAppBehaviour(createWindow).subscribe(() => {
  appEventLog.debug('ran event handler');
});

// We also want to ovserve some events for logging purposes
merge(
  fromAppEvent('quit').pipe(map(({ exitCode }) => ['quit > ', exitCode])),
).subscribe(message => {
  appEventLog.debug(...message);
});
