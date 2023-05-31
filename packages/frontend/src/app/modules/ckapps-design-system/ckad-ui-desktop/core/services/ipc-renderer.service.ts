import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class IpcRendererService {
  private _ipcRenderer: IpcRenderer;

  /**
   * Interop with electron
   */
  public get ipcRenderer() {
    return this._ipcRenderer;
  }

  constructor(@Inject(DOCUMENT) private _doc: Document) {
    const { defaultView } = this._doc;

    if ((defaultView as any).require) {
      try {
        this._ipcRenderer = (defaultView as any).require(
          'electron',
        ).ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }
}
