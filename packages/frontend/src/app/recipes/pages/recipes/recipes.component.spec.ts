import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of } from 'rxjs';
import { RecipeCollectionService } from 'src/app/modules/domain/recipe-collection/services/recipe-collection.service';

import { RecipesPageComponent } from './recipes.component';

describe('RecipesComponent', () => {
  let component: RecipesPageComponent;
  let fixture: ComponentFixture<RecipesPageComponent>;

  const mockRecipeCollectionService = {
    collections$: EMPTY,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipesPageComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: RecipeCollectionService,
          useValue: mockRecipeCollectionService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
