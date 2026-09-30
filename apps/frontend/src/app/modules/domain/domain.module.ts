import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IngredientModule } from './ingredient/ingredient.module';
import { PortionModule } from './portion/portion.module';
import { RecipeModule } from './recipe/recipe.module';
import { TagModule } from './tag/tag.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RecipeModule,
    IngredientModule,
    PortionModule,
    TagModule,
  ],
  exports: [RecipeModule, IngredientModule, PortionModule],
})
export class DomainModule {}
