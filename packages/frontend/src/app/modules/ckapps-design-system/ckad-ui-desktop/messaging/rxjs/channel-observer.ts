import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { fromIpcRendererEvent, IpcMessage } from './from-ipc-renderer-event';
import { invoke$ } from './invoke';
import { send$ } from './send';

export class ChannelObserver {
  /**
   * Observable stream of events on this channel
   */
  public readonly events$: Observable<IpcMessage<unknown>>;

  constructor(
    private ipcRenderer: Electron.IpcRenderer,
    /**
     * channel
     */
    private channel: string,
  ) {
    this.events$ = fromIpcRendererEvent(this.ipcRenderer, this.channel).pipe(
      share(),
    );
  }

  public invoke<T>(...args: unknown[]) {
    const invoke = invoke$<T>(this.ipcRenderer, this.channel);

    return invoke(...args);
  }

  public emit<T>(...args: T[]) {
    const send = send$<T>(this.ipcRenderer, this.channel);

    return send(...args);
  }
}
