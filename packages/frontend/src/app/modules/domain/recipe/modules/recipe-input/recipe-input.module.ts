import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// External modules
import { CkadButtonModule } from 'src/app/modules/ckapps-design-system/ckad-ui-common/ckad-button/ckad-button.module';
import { CkadInputModule } from 'src/app/modules/ckapps-design-system/ckad-ui-common/ckad-input/ckad-input.module';
import { CkadListModule } from 'src/app/modules/ckapps-design-system/ckad-ui-common/ckad-list/ckad-list.module';

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
    // External modules
    CkadButtonModule,
    CkadInputModule,
    CkadListModule,
  ],
  exports: [
    // Module components
    RecipeInputSourcesListComponent,
  ],
})
export class RecipeInputModule {}
