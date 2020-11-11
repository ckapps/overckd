import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// External modules
import { DomainModule } from './modules/domain/domain.module';
import { UiModule } from './modules/ui/ui.module';
import { UiDesktopModule } from './modules/ui-desktop/ui-desktop.module';

// Dependencies to provide
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
import { AppRecipeService } from './services/app-recipe.service';
import { AppRecipeCollectionService } from './services/app-recipe-collection.service';

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
  ],
  providers: [
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
