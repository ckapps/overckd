import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadListComponent } from './list.component';

describe('ListComponent', () => {
  let component: CkadListComponent;
  let fixture: ComponentFixture<CkadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
