import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsMainMenuGroupComponent } from './collections-main-menu-group.component';

describe('CollectionsMainMenuGroupComponent', () => {
  let component: CollectionsMainMenuGroupComponent;
  let fixture: ComponentFixture<CollectionsMainMenuGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollectionsMainMenuGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsMainMenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
