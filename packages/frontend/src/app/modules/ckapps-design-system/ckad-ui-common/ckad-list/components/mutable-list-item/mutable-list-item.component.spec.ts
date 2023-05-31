import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadMutableListItemComponent } from './mutable-list-item.component';

describe('MutableListItemComponent', () => {
  let component: CkadMutableListItemComponent;
  let fixture: ComponentFixture<CkadMutableListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadMutableListItemComponent],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
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
