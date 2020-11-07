import { TestBed } from '@angular/core/testing';

import { AppRecipeService } from './app-recipe.service';

describe('AppRecipeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppRecipeService = TestBed.inject(AppRecipeService);
    expect(service).toBeTruthy();
  });
});
