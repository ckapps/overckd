import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External modules
import { DomainModule } from '../modules/domain/domain.module';
import { UiModule } from '../modules/ui/ui.module';

// Submodules
import { RecipeCollectionsRoutingModule } from './recipe-collections-routing.module';

// Components
import { RecipeCollectionPageWrapperComponent } from './components/recipe-collection-page-wrapper/recipe-collection-page-wrapper.component';
import { RecipeCollectionPageComponent } from './pages/recipe-collection-page/recipe-collection-page.component';

@NgModule({
  declarations: [
    RecipeCollectionPageWrapperComponent,
    RecipeCollectionPageComponent,
  ],
  imports: [
    CommonModule,
    RecipeCollectionsRoutingModule,
    DomainModule,
    UiModule,
  ],
  providers: [],
})
export class RecipeCollectionsModule {}
