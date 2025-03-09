import { Route } from '@angular/router';
import { OverckdNotFoundPage } from '@overckd/ui/common/angular';
import { HomePageComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
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
      import('./routes/recipes/recipe.routes').then(m => m.routes),
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./routes/recipe-collections/recipe-collection.routes').then(
        m => m.routes,
      ),
  },
  { path: '**', component: OverckdNotFoundPage },
];
