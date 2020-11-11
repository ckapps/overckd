import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Domain modules
import { RecipeModule } from './recipe/recipe.module';
import { RecipeCollectionModule } from './recipe-collection/recipe-collection.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, RecipeModule, RecipeCollectionModule],
  exports: [RecipeModule, RecipeCollectionModule],
})
export class DomainModule {}
