import { Routes } from '@angular/router';
import { OverckdCommonSectionPage } from '@overckd/ui/common/angular';
import { RecipeCollectionPageComponent } from './pages/recipe-collection-page/recipe-collection-page.component';

export const routes: Routes = [
  {
    path: '',
    component: OverckdCommonSectionPage,
  },
  {
    path: 'collection',
    component: OverckdCommonSectionPage,

    children: [
      {
        path: ':id',
        component: RecipeCollectionPageComponent,
      },
    ],
  },
];
