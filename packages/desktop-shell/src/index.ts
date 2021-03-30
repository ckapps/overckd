import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as url from 'url';
import { of, throwError, Observable, combineLatest } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { initProtocols } from './protocol';
import { initServer } from './server';
import { ExitCode } from './exit-code.enum';
import { AppConfig, loadConfig } from './config';

import { LogScope, scoped } from './logging';
import { configureDeps } from './configure-dependencies';
import { getPathFromSegments, PathId } from './paths';
import { parseArgs } from './process-args';
import { appIsStable$ } from './core/electron/app-is-stable';

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
    titleBarStyle: 'hiddenInset',
    // titleBarStyle: 'hidden',
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
  // Setting up the dependencies for marble.js
  appLog.debug('marble.js dependencies:: setting up');
  const deps = configureDeps();
  appLog.debug('marble.js dependencies: done');

  // Initialize server
  return initServer(deps, config.server).pipe(
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
  return initConfig$(fromArgs).pipe(
    mergeMap(config => combineLatest([of(config), initProtocols$()])),
    mergeMap(([config]) => startServer$(config)),
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  appEventLog.debug('window-all-closed');

  if (process.platform !== 'darwin') {
    appLog.debug('quit due to window-all-closed');
    app.quit();
  }
});

app.on('activate', () => {
  appEventLog.debug('activate');

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('quit', (e, exitCode) => {
  appEventLog.debug('quit with ', exitCode);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
