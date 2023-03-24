import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientComponent } from './ingredient.component';

@Pipe({
  name: 'ingredientAmount',
})
class MockIngredientAmountPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('IngredientComponent', () => {
  let component: IngredientComponent;
  let fixture: ComponentFixture<IngredientComponent>;

  let mockIngredient;

  beforeEach(() => {
    mockIngredient = {
      name: 'mock-ingredient',

      amount: 123,
      unit: 'g',
      scaleFactor: 1,

      optional: false,
      alternatives: [],
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        IngredientComponent,
        // Mocked
        MockIngredientAmountPipe,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientComponent);
    component = fixture.componentInstance;
    // Set props
    component.ingredient = mockIngredient;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
