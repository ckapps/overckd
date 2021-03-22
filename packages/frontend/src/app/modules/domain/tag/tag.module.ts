import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Submodules
import { TagCommonModule } from './modules/tag-common/tag-common.module';

@NgModule({
  declarations: [],
  exports: [TagCommonModule],
  imports: [CommonModule, TagCommonModule],
})
export class TagModule {}
