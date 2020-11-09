import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RecipeCollectionService } from '../modules/domain/recipe/services/recipe-collection.service';
import { RecipeService } from '../modules/domain/recipe/services/recipe.service';
import { DomainModule } from '../modules/domain/domain.module';

// Module services
import { AppRecipeCollectionService } from '../services/app-recipe-collection.service';
import { AppRecipeService } from '../services/app-recipe.service';

// Module pages
import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
import { RecipePageComponent } from './pages/recipe/recipe.component';
import { RecipesPageComponent } from './pages/recipes/recipes.component';
import { RecipesRoutingModule } from './recipes-routing.module';

@NgModule({
  declarations: [
    EmptyRecipePageComponent,
    RecipePageComponent,
    RecipesPageComponent,
  ],
  imports: [CommonModule, RecipesRoutingModule, DomainModule],
  providers: [
    {
      provide: RecipeService,
      useClass: AppRecipeService,
    },
    {
      provide: RecipeCollectionService,
      useClass: AppRecipeCollectionService,
    },
  ],
})
export class RecipesModule {}
