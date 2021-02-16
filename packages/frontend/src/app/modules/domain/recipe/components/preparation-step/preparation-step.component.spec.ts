import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationStepComponent } from './preparation-step.component';

describe('PreparationStepComponent', () => {
  let component: PreparationStepComponent;
  let fixture: ComponentFixture<PreparationStepComponent>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
