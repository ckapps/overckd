import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationStepComponent } from './preparation-step.component';

describe('PreparationStepComponent', () => {
  let component: PreparationStepComponent;
  let fixture: ComponentFixture<PreparationStepComponent>;

  let mockStep;

  beforeEach(() => {
    mockStep = 'mock-steo';
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PreparationStepComponent],
      }).compileComponents();
    }),
  );

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
