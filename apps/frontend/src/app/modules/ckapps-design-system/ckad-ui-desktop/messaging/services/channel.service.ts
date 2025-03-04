import { Injectable, inject } from '@angular/core';
import { ELECTRON_IPC_RENDERER } from '../../core/electron-interop.tokens';
import { ChannelObserver } from '../rxjs/channel-observer';
import { fromIpcRendererEvent } from '../rxjs/from-ipc-renderer-event';

/**
 * Service for electron interop
 */
@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  readonly #ipcRenderer = inject(ELECTRON_IPC_RENDERER);

  /**
   * @param channel Name of the channel
   *
   * @returns
   * Channel observable
   */
  public createChannel(channel: string) {
    return new ChannelObserver(this.#ipcRenderer, channel);
  }

  /**
   *
   * @param channel Channel for communication
   *
   * @returns
   * Observable stream of message events on the given channel
   */
  fromChannel(channel: string) {
    return fromIpcRendererEvent(this.#ipcRenderer, channel);
  }
}
