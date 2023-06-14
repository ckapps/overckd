import { Injectable } from '@angular/core';

import { IpcRendererService } from '../../core/services/ipc-renderer.service';
import { ChannelObserver } from '../rxjs/channel-observer';
import { fromIpcRendererEvent } from '../rxjs/from-ipc-renderer-event';

/**
 * Service for electron interop
 */
@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private ipcRenderer: IpcRendererService) {}

  /**
   * @param channel Name of the channel
   *
   * @returns
   * Channel observable
   */
  public createChannel(channel: string) {
    return new ChannelObserver(this.ipcRenderer.ipcRenderer, channel);
  }

  /**
   *
   * @param channel Channel for communication
   *
   * @returns
   * Observable stream of message events on the given channel
   */
  fromChannel(channel: string) {
    return fromIpcRendererEvent(this.ipcRenderer.ipcRenderer, channel);
  }
}
