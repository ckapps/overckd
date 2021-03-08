import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AppRecipeService } from './app-recipe.service';
import { UrlBuilderService } from './url-builder.service';

describe('AppRecipeService', () => {
  let service: AppRecipeService;
  let httpTestingController: HttpTestingController;

  let mockUrlBuilderSerivce;

  beforeEach(() => {
    mockUrlBuilderSerivce = {
      url: jest.fn().mockReturnValue('mock-url'),
    };
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppRecipeService,
        { provide: UrlBuilderService, useValue: mockUrlBuilderSerivce },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    service = TestBed.inject(AppRecipeService);
    expect(service).toBeTruthy();
  });
});
