import { Observable } from 'rxjs';

export interface IpcMessage<T> {
  event: Electron.IpcRendererEvent;
  args: T;
}

/**
 * Creates an observable from an stream of events from
 * electron renderer interops on a given channel.
 *
 * @param ipcRenderer Renderer interop
 * @param channel Channel name
 *
 * @returns
 * Observable stream of ipc renderer events
 */
export function fromIpcRendererEvent<T>(
  ipcRenderer: Electron.IpcRenderer,
  channel: string,
): Observable<IpcMessage<T>> {
  return new Observable(subscriber => {
    const handler = (event: Electron.IpcRendererEvent, args: T) => {
      subscriber.next({ event, args });
    };

    ipcRenderer.addListener(channel, handler);

    return () => {
      ipcRenderer.removeListener(channel, handler);
    };
  });
}
