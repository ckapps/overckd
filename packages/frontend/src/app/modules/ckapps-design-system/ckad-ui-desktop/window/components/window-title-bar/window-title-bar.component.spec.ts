import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowTitleBarComponent } from './window-title-bar.component';

@Component({
  selector: 'ckad-desktop-window-navigation-buttons',
  template: '',
})
class MockCkadDesktopWindowNavButtonsComponent {}

describe('WindowTitleBarComponent', () => {
  let component: WindowTitleBarComponent;
  let fixture: ComponentFixture<WindowTitleBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WindowTitleBarComponent,
        // Mocked
        MockCkadDesktopWindowNavButtonsComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
