import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Module submodules
import { IngredientCommonModule } from './modules/ingredient-common/ingredient-common.module';
import { IngredientInputModule } from './modules/ingredient-input/ingredient-input.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Module submodules
    IngredientCommonModule,
    IngredientInputModule,
  ],
  exports: [
    // Module submodules
    IngredientCommonModule,
    IngredientInputModule,
  ],
})
export class IngredientModule {}
