import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CkadCoreModule } from '../../../../ckapps-design-system/ckad-core/ckad-core.module';
import { TagChipComponent } from './components/tag-chip/tag-chip.component';

const COMPONENTS = [TagChipComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [CommonModule, MatChipsModule, CkadCoreModule, FontAwesomeModule],
})
export class TagCommonModule {}
