import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadMainMenuItemComponent } from './main-menu-item.component';

describe('MainMenuItemComponent', () => {
  let component: CkadMainMenuItemComponent;
  let fixture: ComponentFixture<CkadMainMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CkadMainMenuItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkadMainMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
