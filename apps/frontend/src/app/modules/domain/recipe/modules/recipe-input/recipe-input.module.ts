import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CkadButtonComponent } from '@ckapp/ckad-angular/button';
import { CkadInputModule } from '../../../../ckapps-design-system/ckad-ui-common/ckad-input/ckad-input.module';
import { UiModule } from '../../../../ui/ui.module';
import { IngredientModule } from '../../../ingredient/ingredient.module';
import { RecipeInputSourceComponent } from './components/recipe-input-source/recipe-input-source.component';
import { RecipeInputSourcesListComponent } from './components/recipe-input-sources-list/recipe-input-sources-list.component';

/**
 * **overckd/module**
 *
 * Module containing everything needed for
 * `Recipe` and forms
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    // External modules
    UiModule,
    CkadButtonComponent,
    CkadInputModule,
    // Other domain modules
    IngredientModule,
    // Module components
    RecipeInputSourcesListComponent,
    RecipeInputSourceComponent,
  ],
  exports: [
    // Module components
    RecipeInputSourcesListComponent,
  ],
})
export class RecipeInputModule {}
