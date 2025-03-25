import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CkadInputModule } from './ckad-input/ckad-input.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Import submodules
    CkadInputModule,
  ],
  exports: [CkadInputModule],
})
export class CkadUiCommonModule {}
