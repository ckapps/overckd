import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { RecipeCollectionPageWrapperComponent } from './components/recipe-collection-page-wrapper/recipe-collection-page-wrapper.component';
// Pages
import { RecipeCollectionPageComponent } from './pages/recipe-collection-page/recipe-collection-page.component';

// import { RecipesPageComponent } from './pages/recipes/recipes.component';
// import { EmptyRecipePageComponent } from './pages/empty-recipe/empty-recipe.component';
// import { RecipePageComponent } from './pages/recipe/recipe.component';
// import { RecipesPagesWrapperComponent } from './pages/recipes-pages-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: RecipeCollectionPageWrapperComponent,

    children: [
      {
        path: '',
      },
    ],

    // children: [
    //   {
    //     path: 'list',
    //     component: RecipesPageComponent,
    //   },
    //   {
    //     path: 'empty',
    //     component: EmptyRecipePageComponent,
    //   },
    //   {
    //     path: 'recipe',
    //     children: [
    //       {
    //         path: ':id',
    //         component: RecipePageComponent,
    //       },
    //     ],
    //   },
    // ],
  },
  {
    path: 'collection',
    component: RecipeCollectionPageWrapperComponent,

    children: [
      {
        path: ':id',
        component: RecipeCollectionPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeCollectionsRoutingModule {}
