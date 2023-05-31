import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { PortionQuantifierInputComponent } from './components/portion-quantifier-input/portion-quantifier-input.component';
import { PortionCommonModule } from '../portion-common/portion-common.module';

const COMPONENTS = [PortionQuantifierInputComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    // Siblings
    PortionCommonModule,
  ],
})
export class PortionInputModule {}
