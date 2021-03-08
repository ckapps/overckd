import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { RecipeCollectionService } from 'src/app/modules/domain/recipe-collection/services/recipe-collection.service';

import { RecipeCollectionPageComponent } from './recipe-collection-page.component';

describe('RecipeCollectionPageComponent', () => {
  let component: RecipeCollectionPageComponent;
  let fixture: ComponentFixture<RecipeCollectionPageComponent>;

  const mockRoute = {
    paramMap: EMPTY,
  };
  const mockRouter = {
    navigate: jest.fn(),
  };
  const mockRecipeCollectionService = {
    getById: jest.fn().mockReturnValue(EMPTY),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCollectionPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: RecipeCollectionService,
          useValue: mockRecipeCollectionService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCollectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
