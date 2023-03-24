import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeComponent } from './recipe.component';

@Component({
  selector: 'overckd-portion-converter',
  template: '',
})
class MockPortionConverterComponent {}

@Component({
  selector: 'overckd-ingredient-list',
  template: '',
})
class MockIngredientListComponent {}

@Component({
  selector: 'overckd-recipe-tips',
  template: '',
})
class MockRecipeTipsComponent {}

@Component({
  selector: 'overckd-improvement-notes',
  template: '',
})
class MockImprovementNotesComponent {}

@Component({
  selector: 'overckd-preparation',
  template: '',
})
class MockPreparatinoComponent {}

describe('RecipeComponent', () => {
  let component: RecipeComponent;
  let fixture: ComponentFixture<RecipeComponent>;

  let mockRecipe;

  beforeEach(() => {
    mockRecipe = {
      name: 'mock-recipe',

      images: [],
      styles: {},
      tips: [],
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        RecipeComponent,
        // Mocked
        MockPortionConverterComponent,
        MockIngredientListComponent,
        MockRecipeTipsComponent,
        MockImprovementNotesComponent,
        MockPreparatinoComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeComponent);
    component = fixture.componentInstance;
    // Set data
    component.recipe = mockRecipe;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
