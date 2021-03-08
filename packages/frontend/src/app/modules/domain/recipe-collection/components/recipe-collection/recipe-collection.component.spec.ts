import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCollectionComponent } from './recipe-collection.component';

describe('RecipeCollectionComponent', () => {
  let component: RecipeCollectionComponent;
  let fixture: ComponentFixture<RecipeCollectionComponent>;

  let mockRecipeCollection;

  beforeEach(() => {
    mockRecipeCollection = {
      id: 'mock-id',
      name: 'mock-name',
      description: 'mock-description',
      recipes: [],
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCollectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCollectionComponent);
    component = fixture.componentInstance;
    // Set props
    component.recipeCollection = mockRecipeCollection;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
