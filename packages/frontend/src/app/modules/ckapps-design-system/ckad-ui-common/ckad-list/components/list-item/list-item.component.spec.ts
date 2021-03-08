import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadListItemComponent } from './list-item.component';

describe('ListItemComponent', () => {
  let component: CkadListItemComponent;
  let fixture: ComponentFixture<CkadListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadListItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
