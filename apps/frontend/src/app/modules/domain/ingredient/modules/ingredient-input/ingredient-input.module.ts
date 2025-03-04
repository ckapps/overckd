import { NgModule } from '@angular/core';
import { IngredientShelfFilterComponent } from './components/ingredient-shelf-filter/ingredient-shelf-filter.component';

const COMPONENTS = [IngredientShelfFilterComponent];

@NgModule({
  imports: COMPONENTS,
  exports: COMPONENTS,
})
export class IngredientInputModule {}
