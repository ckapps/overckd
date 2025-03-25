import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Submodules
import { CkadButtonModule } from './ckad-button/ckad-button.module';
import { CkadInputModule } from './ckad-input/ckad-input.module';
import { CkadListModule } from './ckad-list/ckad-list.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Import submodules
    CkadButtonModule,
    CkadInputModule,
    CkadListModule,
  ],
  exports: [CkadButtonModule, CkadInputModule, CkadListModule],
})
export class CkadUiCommonModule {}
