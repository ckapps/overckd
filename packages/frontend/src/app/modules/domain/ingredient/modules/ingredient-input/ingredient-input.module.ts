import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Shared modules
import { UiModule } from 'src/app/modules/ui/ui.module';

// Module components
import { IngredientShelfFilterComponent } from './components/ingredient-shelf-filter/ingredient-shelf-filter.component';

const COMPONENTS = [IngredientShelfFilterComponent];

@NgModule({
  declarations: COMPONENTS,
  exports: COMPONENTS,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Material modules
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    // Shared modules
    UiModule,
  ],
})
export class IngredientInputModule {}
