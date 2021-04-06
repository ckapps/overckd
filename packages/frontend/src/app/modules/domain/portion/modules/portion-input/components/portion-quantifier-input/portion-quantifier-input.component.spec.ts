import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortionQuantifierInputComponent } from './portion-quantifier-input.component';

describe('PortionQuantifierInputComponent', () => {
  let component: PortionQuantifierInputComponent;
  let fixture: ComponentFixture<PortionQuantifierInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PortionQuantifierInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionQuantifierInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
