import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  ErrorStateMatcher,
  ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideEffectRuntime } from '@ckapp/angular-effect';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { CollectionQueriesHttp } from '@overckd/collection/adapter-http-client';
import { RecipeQueriesHttp } from '@overckd/recipe/adapter-http-client';
import { Layer } from 'effect';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { ApiHttpClient } from './config/api.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideEffects(),
    provideHttpClient(),
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      // Route parameters reach the pages as inputs
      withComponentInputBinding(),
    ),
    provideAnimations(),
    // External modules
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    // Ports, backed by the API
    provideEffectRuntime(
      Layer.mergeAll(CollectionQueriesHttp, RecipeQueriesHttp).pipe(
        Layer.provide(ApiHttpClient(environment.api)),
      ),
    ),
  ],
};
