import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';

// External modules
import { DomainModule } from './modules/domain/domain.module';
import { UiModule } from './modules/ui/ui.module';
import { UiDesktopModule } from './modules/ui-desktop/ui-desktop.module';

// Dependencies to provide
import { TagService } from './modules/domain/tag/modules/tag-common/services/tag.service';
import { IngredientService } from './modules/domain/ingredient/modules/ingredient-common/services/ingredient.service';
import { RecipeService } from './modules/domain/recipe/services/recipe.service';
import { RecipeCollectionService } from './modules/domain/recipe-collection/services/recipe-collection.service';

// Submodules
import { AppRoutingModule } from './app-routing.module';

// Module stuff
import { AppComponent } from './app.component';
import { NotFoundPageComponent } from './pages/not-found/not-found.component';
import { HomePageComponent } from './pages/home/home.component';
import { AppMainMenuComponent } from './components/app-main-menu/app-main-menu.component';

// Module services
import { AppIngredientService } from './services/app-ingredient.service';
import { AppRecipeService } from './services/app-recipe.service';
import { AppRecipeCollectionService } from './services/app-recipe-collection.service';
import { AppTagService } from './services/app-tag.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    HomePageComponent,
    AppMainMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DomainModule,
    UiModule,
    UiDesktopModule,
    BrowserAnimationsModule,
    // Material modules
    MatListModule,
  ],
  providers: [
    // External modules
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    // Our modules
    {
      provide: IngredientService,
      useClass: AppIngredientService,
    },
    {
      provide: TagService,
      useClass: AppTagService,
    },
    {
      provide: RecipeService,
      useClass: AppRecipeService,
    },
    {
      provide: RecipeCollectionService,
      useClass: AppRecipeCollectionService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
