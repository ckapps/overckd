import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Module pipes
import { IngredientAmountPipe } from './pipes/ingredient-amount.pipe';

@NgModule({
  declarations: [
    // Module pipes
    IngredientAmountPipe,
  ],
  exports: [
    // Module pipes
    IngredientAmountPipe,
  ],
  imports: [CommonModule],
})
export class IngredientCommonModule {}
