import { defer, Observable, of } from 'rxjs';

/**
 * Sends an event message over electrons interop pipe
 *
 * @param ipcRenderer Renderer interop
 * @param channel Channel name
 *
 * @returns
 * A function to send a message and that
 * emits and completes immidieately with the
 * passed arguments.
 */
export function send$<T>(
  ipcRenderer: Electron.IpcRenderer,
  channel: string,
): (...args: T[]) => Observable<T[]> {
  const invokeCall = (args: T[]) => {
    ipcRenderer.send(channel, ...args);
    return of(args);
  };

  return (...args: T[]) => defer(() => invokeCall(args));
}
