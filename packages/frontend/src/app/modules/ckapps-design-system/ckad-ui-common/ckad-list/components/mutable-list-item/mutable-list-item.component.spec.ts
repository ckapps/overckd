import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadMutableListItemComponent } from './mutable-list-item.component';

describe('MutableListItemComponent', () => {
  let component: CkadMutableListItemComponent;
  let fixture: ComponentFixture<CkadMutableListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadMutableListItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadMutableListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
