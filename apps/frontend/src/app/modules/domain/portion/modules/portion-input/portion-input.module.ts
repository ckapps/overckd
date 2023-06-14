import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PortionCommonModule } from '../portion-common/portion-common.module';
import { PortionQuantifierInputComponent } from './components/portion-quantifier-input/portion-quantifier-input.component';

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
