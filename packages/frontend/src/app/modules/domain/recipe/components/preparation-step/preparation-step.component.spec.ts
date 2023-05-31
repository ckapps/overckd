import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationStepComponent } from './preparation-step.component';

describe('PreparationStepComponent', () => {
  let component: PreparationStepComponent;
  let fixture: ComponentFixture<PreparationStepComponent>;

  let mockStep;

  beforeEach(() => {
    mockStep = 'mock-steo';
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreparationStepComponent],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationStepComponent);
    component = fixture.componentInstance;
    // Set props
    component.step = mockStep;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
