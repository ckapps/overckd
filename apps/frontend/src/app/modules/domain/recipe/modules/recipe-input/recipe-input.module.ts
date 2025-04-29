import { SharedUiModule } from '@_shared/ui';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CkadButtonModule } from '@ckapp/angular/button';
import { CkadListModule } from '@ckapp/angular/list';
import { CkadUiCommonModule } from '../../../../ckapps-design-system/ckad-ui-common/ckad-ui-common.module';
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
    CkadUiCommonModule,
    SharedUiModule,
    CkadButtonModule,
    CkadListModule,
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
