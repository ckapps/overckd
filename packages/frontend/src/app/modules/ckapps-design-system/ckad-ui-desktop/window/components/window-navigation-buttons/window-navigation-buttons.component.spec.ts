import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowNavigationButtonsComponent } from './window-navigation-buttons.component';

@Component({
  selector: 'fa-icon',
  template: '',
})
class MockFontawesomeIconComponent {}

describe('WindowNavigationButtonsComponent', () => {
  let component: WindowNavigationButtonsComponent;
  let fixture: ComponentFixture<WindowNavigationButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WindowNavigationButtonsComponent,
        // Mocked
        MockFontawesomeIconComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowNavigationButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
