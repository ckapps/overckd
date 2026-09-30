import { NgModule } from '@angular/core';
import { TagChipComponent } from './components/tag-chip/tag-chip.component';

const COMPONENTS = [TagChipComponent];

@NgModule({
  exports: COMPONENTS,
  imports: COMPONENTS,
})
export class TagCommonModule {}
