import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import { RecipeCollectionService } from './modules/domain/recipe-collection/services/recipe-collection.service';
import { RecipeService } from './modules/domain/recipe/services/recipe.service';
import { AppRecipeCollectionService } from './services/app-recipe-collection.service';
import { AppRecipeService } from './services/app-recipe.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideEffects(),
    provideHttpClient(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideAnimations(),
    // External modules
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    // Our modules
    {
      provide: RecipeService,
      useClass: AppRecipeService,
    },
    {
      provide: RecipeCollectionService,
      useClass: AppRecipeCollectionService,
    },
  ],
};
