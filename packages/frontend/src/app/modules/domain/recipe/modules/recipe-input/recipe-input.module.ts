import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

// External modules
import { CkadButtonModule } from 'src/app/modules/ckapps-design-system/ckad-ui-common/ckad-button/ckad-button.module';
import { CkadInputModule } from 'src/app/modules/ckapps-design-system/ckad-ui-common/ckad-input/ckad-input.module';
import { CkadListModule } from 'src/app/modules/ckapps-design-system/ckad-ui-common/ckad-list/ckad-list.module';
import { UiModule } from 'src/app/modules/ui/ui.module';

// Other domain modules
import { IngredientModule } from '../../../ingredient/ingredient.module';

// Module components
import { RecipeInputSourcesListComponent } from './components/recipe-input-sources-list/recipe-input-sources-list.component';
import { RecipeInputSourceComponent } from './components/recipe-input-source/recipe-input-source.component';

/**
 * **overckd/module**
 *
 * Module containing everything needed for
 * `Recipe` and forms
 */
@NgModule({
  declarations: [
    // Module components
    RecipeInputSourcesListComponent,
    RecipeInputSourceComponent,
  ],
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
    CkadButtonModule,
    CkadInputModule,
    CkadListModule,
    // Other domain modules
    IngredientModule,
  ],
  exports: [
    // Module components
    RecipeInputSourcesListComponent,
  ],
})
export class RecipeInputModule {}
