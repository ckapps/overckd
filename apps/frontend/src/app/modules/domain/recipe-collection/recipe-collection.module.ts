import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { RouterModule } from '@angular/router';
import { UiModule } from '../../ui/ui.module';
import { CollectionsMainMenuGroupComponent } from './components/collections-main-menu-group/collections-main-menu-group.component';
import { RecipeCollectionComponent } from './components/recipe-collection/recipe-collection.component';

@NgModule({
  declarations: [CollectionsMainMenuGroupComponent, RecipeCollectionComponent],
  imports: [CommonModule, RouterModule, MatListModule, UiModule],
  exports: [CollectionsMainMenuGroupComponent, RecipeCollectionComponent],
})
export class RecipeCollectionModule {}
