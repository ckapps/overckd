import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

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
