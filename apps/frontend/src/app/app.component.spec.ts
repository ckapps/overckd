import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AppMainMenuComponent } from './components/app-main-menu/app-main-menu.component';
import { CkadUiDesktopModule } from './modules/ckapps-design-system/ckad-ui-desktop/ckad-ui-desktop.module';

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
      providers: [provideRouter([])],
    }).compileComponents();

    TestBed.overrideComponent(AppComponent, {
      remove: {
        imports: [AppMainMenuComponent, CkadUiDesktopModule],
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
