import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';
import { IpcRenderer } from 'electron';

export type RequireFn = <T>(moduleName: string) => T;
export const REQUIRE_FN = new InjectionToken<RequireFn>('require_fn', {
  providedIn: 'platform',
  factory: () => {
    const _doc = inject<Document>(DOCUMENT);
    const { defaultView } = _doc;
    if (!(defaultView as any).require) {
      throw new Error('No require function found');
    }
    return (moduleName: string) => (defaultView as any).require(moduleName);
  },
});

export const ELECTRON_MODULE = new InjectionToken<{ ipcRenderer: IpcRenderer }>(
  'electron',
  {
    providedIn: 'platform',
    factory: () => {
      return inject(REQUIRE_FN)<{ ipcRenderer: IpcRenderer }>('electron');
    },
  },
);

export const ELECTRON_IPC_RENDERER = new InjectionToken<IpcRenderer>(
  'electron/IPC_RENDERER',
  {
    providedIn: 'platform',
    factory: () => {
      return inject(ELECTRON_MODULE).ipcRenderer;
    },
  },
);
