import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home/home.component';

import { NotFoundPageComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    pathMatch: 'full',
    component: HomePageComponent,
  },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./routes/recipes/recipes.module').then(m => m.RecipesModule),
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./routes/recipe-collections/recipe-collections.module').then(
        m => m.RecipeCollectionsModule,
      ),
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
