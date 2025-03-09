import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CkadButtonComponent } from './button.component';

describe('CkadButtonButton', () => {
  let component: CkadButtonComponent;
  let fixture: ComponentFixture<CkadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
