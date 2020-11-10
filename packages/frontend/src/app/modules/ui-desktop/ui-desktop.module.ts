import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External modules
import { CkappsUiDesktopModule } from '../ckapps-design-system/ckapps-ui-desktop/ckapps-ui-desktop.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CkappsUiDesktopModule],
  exports: [CkappsUiDesktopModule],
})
export class UiDesktopModule {}
