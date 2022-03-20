import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagChipComponent } from './components/tag-chip/tag-chip.component';
import { MatChipsModule } from '@angular/material/chips';
import { CkadCoreModule } from 'src/app/modules/ckapps-design-system/ckad-core/ckad-core.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const COMPONENTS = [TagChipComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [CommonModule, MatChipsModule, CkadCoreModule, FontAwesomeModule],
})
export class TagCommonModule {}
