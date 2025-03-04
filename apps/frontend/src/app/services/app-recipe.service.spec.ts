import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { AppRecipeService } from './app-recipe.service';
import { UrlBuilderService } from './url-builder.service';

describe('AppRecipeService', () => {
  let spectator: SpectatorService<AppRecipeService>;
  const createService = createServiceFactory({
    service: AppRecipeService,
    mocks: [UrlBuilderService],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });
});
