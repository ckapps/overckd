import { Routes } from '@angular/router';
import { CollectionPageWrapperComponent } from './collection-page-wrapper/collection-page-wrapper.component';
import { CollectionPageComponent } from './collection-page/collection-page.component';

/** The collection pages, under `/collections` */
export const collectionRoutes: Routes = [
  {
    path: '',
    component: CollectionPageWrapperComponent,
  },
  {
    path: 'collection',
    component: CollectionPageWrapperComponent,

    children: [
      {
        path: ':id',
        component: CollectionPageComponent,
      },
    ],
  },
];
