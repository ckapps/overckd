import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { CkappsUiButtonModule } from './button/button.module';
import { CkadMainMenuModule } from './ckad-main-menu/ckad-main-menu.module';
import { CkadInputModule } from './ckad-input/ckad-input.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CkappsUiButtonModule,
    CkadMainMenuModule,
    CkadInputModule,
  ],
  exports: [CkadInputModule, CkappsUiButtonModule, CkadMainMenuModule],
})
export class CkappsUiCommonModule {}
