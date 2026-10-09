import { Routes } from '@angular/router';
import { EmptyRecipePageComponent } from './empty-recipe-page/empty-recipe-page.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipesPageComponent } from './recipes-page/recipes-page.component';
import { RecipesPagesWrapperComponent } from './recipes-pages-wrapper/recipes-pages-wrapper.component';

/** The recipe pages, under `/recipes` */
export const recipeRoutes: Routes = [
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
