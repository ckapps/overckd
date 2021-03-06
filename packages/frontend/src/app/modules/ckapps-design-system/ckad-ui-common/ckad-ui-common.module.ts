import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { CkadButtonModule } from './ckad-button/ckad-button.module';
import { CkadMainMenuModule } from './ckad-main-menu/ckad-main-menu.module';
import { CkadInputModule } from './ckad-input/ckad-input.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CkadButtonModule,
    CkadMainMenuModule,
    CkadInputModule,
  ],
  exports: [CkadInputModule, CkadButtonModule, CkadMainMenuModule],
})
export class CkadUiCommonModule {}
