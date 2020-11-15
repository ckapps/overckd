import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Domain modules
import { RecipeModule } from './recipe/recipe.module';
import { RecipeCollectionModule } from './recipe-collection/recipe-collection.module';
import { IngredientModule } from './ingredient/ingredient.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RecipeModule,
    RecipeCollectionModule,
    IngredientModule,
  ],
  exports: [RecipeModule, RecipeCollectionModule, IngredientModule],
})
export class DomainModule {}
