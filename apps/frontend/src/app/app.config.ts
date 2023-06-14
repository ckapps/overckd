import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { IngredientService } from './modules/domain/ingredient/modules/ingredient-common/services/ingredient.service';
import { RecipeCollectionService } from './modules/domain/recipe-collection/services/recipe-collection.service';
import { RecipeService } from './modules/domain/recipe/services/recipe.service';
import { TagService } from './modules/domain/tag/modules/tag-common/services/tag.service';
import { AppIngredientService } from './services/app-ingredient.service';
import { AppRecipeCollectionService } from './services/app-recipe-collection.service';
import { AppRecipeService } from './services/app-recipe.service';
import { AppTagService } from './services/app-tag.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),

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
};
