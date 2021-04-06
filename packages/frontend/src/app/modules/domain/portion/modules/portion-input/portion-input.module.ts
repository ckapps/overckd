import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PortionQuantifierInputComponent } from './components/portion-quantifier-input/portion-quantifier-input.component';
import { PortionCommonModule } from '../portion-common/portion-common.module';

@NgModule({
  declarations: [PortionQuantifierInputComponent],
  exports: [PortionQuantifierInputComponent],
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
