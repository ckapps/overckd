import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CkadMutableListComponent } from './mutable-list.component';

describe('MutableListComponent', () => {
  let component: CkadMutableListComponent;
  let fixture: ComponentFixture<CkadMutableListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadMutableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
