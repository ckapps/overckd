import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkadMainMenuItemComponent } from './main-menu-item.component';

@Component({
  selector: 'fa-icon',
  template: '',
})
class MockFontawesomeIconComponent {}

describe('MainMenuItemComponent', () => {
  let component: CkadMainMenuItemComponent;
  let fixture: ComponentFixture<CkadMainMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CkadMainMenuItemComponent,
        // Mocked
        MockFontawesomeIconComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
