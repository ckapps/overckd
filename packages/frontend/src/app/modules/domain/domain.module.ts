import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Domain modules
import { RecipeModule } from './recipe/recipe.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, RecipeModule],
  exports: [RecipeModule],
})
export class DomainModule {}
