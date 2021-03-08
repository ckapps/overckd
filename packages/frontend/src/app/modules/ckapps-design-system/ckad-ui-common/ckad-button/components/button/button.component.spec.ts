import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';

import { CkadButtonButtonComponent } from './button.component';

describe('CkadButtonButton', () => {
  let component: CkadButtonButtonComponent;
  let fixture: ComponentFixture<CkadButtonButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadButtonButtonComponent],
      imports: [MatButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadButtonButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
