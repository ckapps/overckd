import { app } from 'electron';
import { Observable } from 'rxjs';

import { ElectronLogScope, logFactory } from '../core/log';
import {
  AppBrowserWindowEvent,
  AppEvent,
  AppTypeEvent,
  AppWebContentsEvent,
} from './app-event.types';

const logger = logFactory(ElectronLogScope.AppEvent);

// App events

export function fromAppEvent(event: 'before-quit'): Observable<AppEvent>;
export function fromAppEvent(event: 'will-quit'): Observable<AppEvent>;

// With browserwindow
export function fromAppEvent(
  event: 'browser-window-blur',
): Observable<AppBrowserWindowEvent>;
export function fromAppEvent(
  event: 'browser-window-created',
): Observable<AppBrowserWindowEvent>;
export function fromAppEvent(
  event: 'browser-window-focus',
): Observable<AppBrowserWindowEvent>;

// WebContents Events
export function fromAppEvent(
  event: 'web-contents-created',
): Observable<AppWebContentsEvent>;

// Type Events
export function fromAppEvent(
  event: 'will-continue-activity',
): Observable<AppTypeEvent>;

// Noop Events
export function fromAppEvent(event: 'will-finish-launching'): Observable<void>;
export function fromAppEvent(event: 'window-all-closed'): Observable<void>;

/**
 * Creates
 * @param event
 * @returns
 */
export function fromAppEvent(event: string): Observable<any> {
  return new Observable<AppEvent>(subscriber => {
    const converter = getMapFn(event);
    const handler = (...args: any[]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      subscriber.next(converter(...args));
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.on(event, handler);

    return () => {
      app.off(event, handler);
    };
  });
}

const noopEventHandler = () => {
  void 0;
};

const eventHandler = (event: Electron.Event) => ({
  event,
});

const browserWindowEventHandler = (
  event: Electron.Event,
  browserWindow: Electron.BrowserWindow,
) => ({
  event,
  browserWindow,
});

const webContentsEventHandler = (
  event: Electron.Event,
  webContents: Electron.WebContents,
) => ({
  event,
  webContents,
});

const typeEventHandler = (event: Electron.Event, type: string) => ({
  event,
  type,
});

function getMapFn(event: string) {
  switch (event) {
    case 'before-quit':
    case 'will-quit':
      return eventHandler;

    case 'browser-window-blur':
    case 'browser-window-created':
    case 'browser-window-focus':
      return browserWindowEventHandler;

    case 'web-contents-created':
      return webContentsEventHandler;

    case 'will-continue-activity':
      return typeEventHandler;

    //   case 'browser-window-blur':
    case 'will-finish-launching':
    case 'window-all-closed':
      return noopEventHandler;

    default:
      break;
  }
}
