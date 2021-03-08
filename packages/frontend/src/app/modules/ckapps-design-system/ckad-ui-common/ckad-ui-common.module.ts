import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { CkadButtonModule } from './ckad-button/ckad-button.module';
import { CkadInputModule } from './ckad-input/ckad-input.module';
import { CkadListModule } from './ckad-list/ckad-list.module';
import { CkadMainMenuModule } from './ckad-main-menu/ckad-main-menu.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Import submodules
    CkadButtonModule,
    CkadInputModule,
    CkadListModule,
    CkadMainMenuModule,
  ],
  exports: [
    CkadButtonModule,
    CkadInputModule,
    CkadListModule,
    CkadMainMenuModule,
  ],
})
export class CkadUiCommonModule {}
