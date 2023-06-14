import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationComponent } from './preparation.component';

@Component({
  selector: 'overckd-preparation-step',
  template: '',
})
class MockPreparationStepComponent {}

describe('PreparationComponent', () => {
  let component: PreparationComponent;
  let fixture: ComponentFixture<PreparationComponent>;

  let mockRecipe;

  beforeEach(() => {
    mockRecipe = {
      images: [],
      name: 'mock-name',
      ingredients: [],
      steps: [],
      tips: ['mock-tip-1', 'mock-tip-2'],
      styles: {},
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PreparationComponent,
        // Mocked
        MockPreparationStepComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationComponent);
    component = fixture.componentInstance;
    // Set props
    component.recipe = mockRecipe;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
