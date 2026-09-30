import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CkadButtonRaisedComponent } from './button-raised.component';

describe('CkadButtonRaisedComponent', () => {
  let component: CkadButtonRaisedComponent;
  let fixture: ComponentFixture<CkadButtonRaisedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadButtonRaisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
