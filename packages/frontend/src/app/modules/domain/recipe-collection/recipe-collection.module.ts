import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External modules
import { UiModule } from '../../ui/ui.module';

// Components
import { CollectionsMainMenuGroupComponent } from './components/collections-main-menu-group/collections-main-menu-group.component';
import { RouterModule } from '@angular/router';
import { RecipeCollectionComponent } from './components/recipe-collection/recipe-collection.component';

@NgModule({
  declarations: [CollectionsMainMenuGroupComponent, RecipeCollectionComponent],
  imports: [CommonModule, UiModule, RouterModule],
  exports: [CollectionsMainMenuGroupComponent, RecipeCollectionComponent],
})
export class RecipeCollectionModule {}
