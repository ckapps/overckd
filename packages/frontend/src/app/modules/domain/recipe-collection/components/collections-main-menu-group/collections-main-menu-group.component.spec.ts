import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { RecipeCollectionService } from '../../services/recipe-collection.service';

import { CollectionsMainMenuGroupComponent } from './collections-main-menu-group.component';

@Component({
  selector: 'ckad-main-menu-item',
  template: '',
})
class MockCkadMainMenuItemComponent {}

@Component({
  selector: 'ckad-main-menu-group',
  template: '',
})
export class MockCkadMainMenuGroupComponent {}

describe('CollectionsMainMenuGroupComponent', () => {
  let component: CollectionsMainMenuGroupComponent;
  let fixture: ComponentFixture<CollectionsMainMenuGroupComponent>;

  const mockRecipeCollectionService = {
    collections$: EMPTY,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CollectionsMainMenuGroupComponent,
        // Mocked
        MockCkadMainMenuItemComponent,
        MockCkadMainMenuGroupComponent,
      ],
      providers: [
        {
          provide: RecipeCollectionService,
          useValue: mockRecipeCollectionService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsMainMenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
