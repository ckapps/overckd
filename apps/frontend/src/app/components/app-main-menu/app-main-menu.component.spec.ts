import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { RecipeCollectionModule } from '../../modules/domain/recipe-collection/recipe-collection.module';
import { AppMainMenuComponent } from './app-main-menu.component';

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
      providers: [provideRouter([]), provideNoopAnimations()],
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
