import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientListComponent } from './ingredient-list.component';

@Component({
  selector: 'overckd-ingredient-group',
  template: '',
})
class MockIngredientGroupComponent {}

@Component({
  selector: 'overckd-ingredient',
  template: '',
})
class MockIngredientComponent {}

describe('IngredientListComponent', () => {
  let component: IngredientListComponent;
  let fixture: ComponentFixture<IngredientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        IngredientListComponent,
        // Mocked
        MockIngredientGroupComponent,
        MockIngredientComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
