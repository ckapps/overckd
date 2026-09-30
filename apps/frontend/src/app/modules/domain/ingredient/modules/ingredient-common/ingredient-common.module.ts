import { NgModule } from '@angular/core';
import { IngredientAmountPipe } from './pipes/ingredient-amount.pipe';

@NgModule({
  exports: [IngredientAmountPipe],
  imports: [IngredientAmountPipe],
})
export class IngredientCommonModule {}
