import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RecipeService } from 'src/app/modules/domain/recipe/services/recipe.service';

import { RecipePageComponent } from './recipe.component';

describe('RecipesComponent', () => {
  let component: RecipePageComponent;
  let fixture: ComponentFixture<RecipePageComponent>;

  const mockRoute = {
    paramMap: of({
      get: jest.fn().mockReturnValue('param'),
    }),
  };
  const mockRecipeService = {};

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecipePageComponent],
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
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
