import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { PortionCommonModule } from './modules/portion-common/portion-common.module';
import { PortionInputModule } from './modules/portion-input/portion-input.module';

@NgModule({
  declarations: [],
  exports: [PortionCommonModule, PortionInputModule],
  imports: [CommonModule, PortionCommonModule, PortionInputModule],
})
export class PortionModule {}
