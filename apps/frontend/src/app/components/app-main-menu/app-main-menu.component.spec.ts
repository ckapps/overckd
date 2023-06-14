import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeCollectionModule } from '../../modules/domain/recipe-collection/recipe-collection.module';
import { AppMainMenuComponent } from './app-main-menu.component';

@Component({
  selector: 'ckad-main-menu',
  template: '',
})
class MockCkadMainMenuComponent {}

@Component({
  selector: 'ckad-main-menu-item',
  template: '',
})
class MockCkadMainMenuItemComponent {}

@Component({
  selector: 'ckad-main-menu-group',
  template: '',
})
class MockCkadMainMenuGroupComponent {}

@Component({
  selector: 'overckd-collections-main-menu-group',
  template: '',
  standalone: true,
})
class MockCollectionsMainMenuGroupComponent {}

describe('AppMainMenuComponent', () => {
  let component: AppMainMenuComponent;
  let fixture: ComponentFixture<AppMainMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        // Mocks
        // MockCkadMainMenuComponent,
        // MockCkadMainMenuItemComponent,
        // MockCkadMainMenuGroupComponent,
      ],
      imports: [RouterTestingModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    TestBed.overrideComponent(AppMainMenuComponent, {
      remove: {
        imports: [RecipeCollectionModule],
      },
      add: {
        imports: [MockCollectionsMainMenuGroupComponent],
      },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
