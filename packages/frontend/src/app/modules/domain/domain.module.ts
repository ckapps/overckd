import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Domain modules
import { RecipeModule } from './recipe/recipe.module';
import { RecipeCollectionModule } from './recipe-collection/recipe-collection.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { PortionModule } from './portion/portion.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RecipeModule,
    RecipeCollectionModule,
    IngredientModule,
    PortionModule,
  ],
  exports: [
    RecipeModule,
    RecipeCollectionModule,
    IngredientModule,
    PortionModule,
  ],
})
export class DomainModule {}
