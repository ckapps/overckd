import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientGroupComponent } from './ingredient-group.component';

@Component({
  selector: 'overckd-ingredient-list-input',
  template: '',
})
export class MockIngredientListInputComponent {}

describe('IngredientGroupComponent', () => {
  let component: IngredientGroupComponent;
  let fixture: ComponentFixture<IngredientGroupComponent>;

  let mockIngredientGroup;

  beforeEach(() => {
    mockIngredientGroup = {
      group: 'mock-group',
      label: 'mock-label',
      ingredients: [{ name: 'mock-ingredient' }],
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IngredientGroupComponent,
        // Mocked
        MockIngredientListInputComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientGroupComponent);
    component = fixture.componentInstance;
    // Set props
    component.ingredientGroup = mockIngredientGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
