import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';

// Shared modules
import { UiModule } from 'src/app/modules/ui/ui.module';

// Module components
import { IngredientShelfFilterComponent } from './components/ingredient-shelf-filter/ingredient-shelf-filter.component';
import { IngredientListInputComponent } from './components/ingredient-list-input/ingredient-list-input.component';

@NgModule({
  declarations: [IngredientShelfFilterComponent, IngredientListInputComponent],
  exports: [IngredientShelfFilterComponent, IngredientListInputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Material modules
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    // Shared modules
    UiModule,
  ],
})
export class IngredientInputModule {}
