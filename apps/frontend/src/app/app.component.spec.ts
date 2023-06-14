import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppMainMenuComponent } from './components/app-main-menu/app-main-menu.component';
import { UiDesktopModule } from './modules/ui-desktop/ui-desktop.module';

@Component({
  selector: 'ckad-desktop-window-title-bar',
  template: '',
  standalone: true,
})
class MockWindowTitleBarComponent {}

@Component({
  selector: 'app-main-menu',
  template: '',
  standalone: true,
})
class MockAppMainMenuComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [RouterTestingModule],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    TestBed.overrideComponent(AppComponent, {
      remove: {
        imports: [AppMainMenuComponent, UiDesktopModule],
      },
      add: {
        imports: [MockAppMainMenuComponent, MockWindowTitleBarComponent],
      },
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
