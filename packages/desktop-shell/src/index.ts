import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as url from 'url';
import log from 'electron-log';

import { initProtocols } from './protocol';
import { initServer } from './server';
import { ExitCode } from './exit-code.enum';
import { AppConfig, loadConfig } from './config';

import { LogScope } from './log-scope.enum';
import { configureDeps } from './configure-dependencies';
import { getPathFromSegments, PathId } from './paths';
import { parseArgs } from './process-args';

const appLog = log.scope(LogScope.App);
const appEventLog = log.scope(LogScope.AppEvent);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  appLog.info('creating/removing shortcuts on windows. Quitting...');
  // eslint-disable-line global-require
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

/**
 * Initializes the application.
 *
 * @returns
 * A promise that resolves with an exit code or with `undefined`.
 * If an exit code was returned, the application should exit.
 */
const initApp = async (): Promise<ExitCode | undefined> => {
  appLog.silly('initApp');

  // Loading the application configuration
  let config: AppConfig;
  try {
    config = await loadConfig(args.config);
  } catch (loadConfigError) {
    appLog.error('could not parse config file', loadConfigError);
    return ExitCode.ConfigFileInvalid;
  }

  // Setting up the dependencies for marble.js
  appLog.debug('marble.js dependencies:: setting up');
  const deps = configureDeps();
  appLog.debug('marble.js dependencies: done');

  // Initialize protocols
  if (!initProtocols()) {
    appLog.error('could not initialize protocols');
    return ExitCode.ProtocolRegistrationFailed;
  }

  // Initialize server
  const result = await initServer(deps, config.server);
  if (!result) {
    appLog.error('could not initialize server');
    return ExitCode.ServerStartFailed;
  }

  // All initialized OK
  return undefined;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  appEventLog.debug('ready');

  const exitCode = await initApp();

  // If some exit code was returned, terminate the app
  if (exitCode !== undefined) {
    app.exit(exitCode);
    return;
  }

  createWindow();
});

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
