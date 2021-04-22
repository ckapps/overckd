import { defer, from, Observable } from 'rxjs';

/**
 * Invokes an event message over electrons interop pipe
 *
 * @param ipcRenderer Renderer interop
 * @param channel Channel name
 *
 * @returns
 * A function to invoke a message and that
 * emits and completes with the resolved
 * message.
 */
export function invoke$<T>(
  ipcRenderer: Electron.IpcRenderer,
  channel: string,
): (...args: unknown[]) => Observable<T> {
  const invokeCall = (args: unknown[]) =>
    from<Promise<T>>(ipcRenderer.invoke(channel, ...args));

  return (...args: unknown[]) => defer(() => invokeCall(args));
}
