import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { EMPTY } from 'rxjs';
import { RecipeCollectionService } from '../../modules/domain/recipe-collection/services/recipe-collection.service';
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

  const mockRecipeCollectionService = {
    collections$: EMPTY,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: RecipeCollectionService,
          useValue: mockRecipeCollectionService,
        },
      ],
    }).compileComponents();
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
