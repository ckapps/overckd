import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Module submodules
import { IngredientCommonModule } from './modules/ingredient-common/ingredient-common.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Module submodules
    IngredientCommonModule,
  ],
  exports: [
    // Module submodules
    IngredientCommonModule,
  ],
})
export class IngredientModule {}
