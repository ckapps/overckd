import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadInputFieldComponent } from './input-field.component';

describe('CkadInputFieldComponent', () => {
  let component: CkadInputFieldComponent;
  let fixture: ComponentFixture<CkadInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadInputFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
