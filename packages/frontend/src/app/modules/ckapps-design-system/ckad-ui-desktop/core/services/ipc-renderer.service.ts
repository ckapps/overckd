import { Injectable } from '@angular/core';

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

  constructor() {
    if ((window as any).require) {
      try {
        this._ipcRenderer = (window as any).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }
}
