import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

@Component({
  selector: 'ckad-desktop-window-title-bar',
  template: '',
})
class MockWindowTitleBarComponent {}

@Component({
  selector: 'app-main-menu',
  template: '',
})
class MockAppMainMenuComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        AppComponent,
        // Mocked
        MockWindowTitleBarComponent,
        MockAppMainMenuComponent,
    ],
    imports: [RouterTestingModule],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
