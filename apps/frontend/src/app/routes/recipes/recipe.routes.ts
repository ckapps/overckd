import { OverckdCommonSectionPage } from '@overckd/ui/common/angular';
import { AddRecipePageComponent } from './pages/add-recipe/add-recipe.component';
import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
import { RecipePageComponent } from './pages/recipe/recipe.component';
import { RecipesPageComponent } from './pages/recipes/recipes.component';

export const routes = [
  {
    path: '',
    component: OverckdCommonSectionPage,

    children: [
      {
        path: 'list',
        component: RecipesPageComponent,
      },
      {
        path: 'add',
        component: AddRecipePageComponent,
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
