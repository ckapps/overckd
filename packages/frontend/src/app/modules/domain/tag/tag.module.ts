import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { TagCommonModule } from './modules/tag-common/tag-common.module';

const SUBMODULES = [TagCommonModule];

@NgModule({
  declarations: [],
  exports: SUBMODULES,
  imports: [CommonModule, ...SUBMODULES],
})
export class TagModule {}
