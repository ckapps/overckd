import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientListInputComponent } from './ingredient-list-input.component';

@Component({
  selector: 'overckd-ingredient-shelf-filter',
  template: '',
})
class MockIngredientShelfFilterComponent {}

describe('IngredientListInputComponent', () => {
  let component: IngredientListInputComponent;
  let fixture: ComponentFixture<IngredientListInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IngredientListInputComponent,
        // Mocked
        MockIngredientShelfFilterComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
