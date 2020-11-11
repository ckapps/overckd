import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// External submodules
import { DomainModule } from '../modules/domain/domain.module';
import { UiModule } from '../modules/ui/ui.module';

// Submodules
import { RecipesRoutingModule } from './recipes-routing.module';

// Module pages
import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
import { RecipePageComponent } from './pages/recipe/recipe.component';
import { RecipesPageComponent } from './pages/recipes/recipes.component';
import { RecipesPagesWrapperComponent } from './pages/recipes-pages-wrapper.component';

@NgModule({
  declarations: [
    EmptyRecipePageComponent,
    RecipePageComponent,
    RecipesPageComponent,
    RecipesPagesWrapperComponent,
  ],
  imports: [CommonModule, RecipesRoutingModule, DomainModule, UiModule],
})
export class RecipesModule {}
