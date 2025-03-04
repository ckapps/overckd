import { NgModule } from '@angular/core';
import { CollectionsMainMenuGroupComponent } from './components/collections-main-menu-group/collections-main-menu-group.component';
import { RecipeCollectionComponent } from './components/recipe-collection/recipe-collection.component';

@NgModule({
  imports: [CollectionsMainMenuGroupComponent, RecipeCollectionComponent],
  exports: [CollectionsMainMenuGroupComponent, RecipeCollectionComponent],
})
export class RecipeCollectionModule {}
