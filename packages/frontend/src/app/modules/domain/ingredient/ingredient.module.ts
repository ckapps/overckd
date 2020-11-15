import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientAmountPipe } from './pipes/ingredient-amount.pipe';

@NgModule({
  declarations: [IngredientAmountPipe],
  imports: [CommonModule],
  exports: [IngredientAmountPipe],
})
export class IngredientModule {}
