import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
import { RecipePageComponent } from './pages/recipe/recipe.component';
import { RecipesPagesWrapperComponent } from './pages/recipes-pages-wrapper.component';
import { RecipesPageComponent } from './pages/recipes/recipes.component';

const routes: Routes = [
  {
    path: '',
    component: RecipesPagesWrapperComponent,

    children: [
      {
        path: 'list',
        component: RecipesPageComponent,
      },
      {
        path: 'empty',
        component: EmptyRecipePageComponent,
      },
      {
        path: 'recipe',
        children: [
          {
            path: ':name',
            component: RecipePageComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
