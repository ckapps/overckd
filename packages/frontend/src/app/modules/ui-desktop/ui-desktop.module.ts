import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External modules
import { CkadUiDesktopModule } from '../ckapps-design-system/ckad-ui-desktop/ckad-ui-desktop.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CkadUiDesktopModule],
  exports: [CkadUiDesktopModule],
})
export class UiDesktopModule {}
