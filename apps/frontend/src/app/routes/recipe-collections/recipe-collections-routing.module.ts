import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeCollectionPageWrapperComponent } from './components/recipe-collection-page-wrapper/recipe-collection-page-wrapper.component';
import { RecipeCollectionPageComponent } from './pages/recipe-collection-page/recipe-collection-page.component';

const routes: Routes = [
  {
    path: '',
    component: RecipeCollectionPageWrapperComponent,
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
