import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesPageComponent } from './pages/recipes/recipes.component';
import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
import { RecipePageComponent } from './pages/recipe/recipe.component';
import { RecipesPagesWrapperComponent } from './pages/recipes-pages-wrapper.component';

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
            path: ':id',
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
