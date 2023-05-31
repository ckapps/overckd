import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RecipeService } from 'src/app/modules/domain/recipe/services/recipe.service';
import { RecipePageComponent } from './recipe.component';

@Component({
  selector: 'overckd-recipe',
  template: '',
})
class MockRecipeComponent {}

describe('RecipesComponent', () => {
  let component: RecipePageComponent;
  let fixture: ComponentFixture<RecipePageComponent>;

  const mockRoute = {
    paramMap: of({
      get: jest.fn().mockReturnValue('param'),
    }),
  };
  const mockRecipeService = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecipePageComponent,
        // Mocked
        MockRecipeComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockRoute,
        },
        {
          provide: RecipeService,
          useValue: mockRecipeService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
