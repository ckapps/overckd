import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// External submodules
import { DomainModule } from '../modules/domain/domain.module';
import { UiModule } from '../modules/ui/ui.module';

// Submodules
import { RecipesRoutingModule } from './recipes-routing.module';

// Module pages
import { AddRecipePageComponent } from './pages/add-recipe/add-recipe.component';
import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
import { RecipePageComponent } from './pages/recipe/recipe.component';
import { RecipesPageComponent } from './pages/recipes/recipes.component';
import { RecipesPagesWrapperComponent } from './pages/recipes-pages-wrapper.component';

@NgModule({
  declarations: [
    AddRecipePageComponent,
    EmptyRecipePageComponent,
    RecipePageComponent,
    RecipesPageComponent,
    RecipesPagesWrapperComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    RecipesRoutingModule,
    DomainModule,
    UiModule,
  ],
})
export class RecipesModule {}
