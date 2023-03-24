import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeInputSourcesListComponent } from './recipe-input-sources-list.component';

@Component({
  selector: 'fa-icon',
  template: '',
})
class MockFontawesomeIconComponent {}

@Component({
  selector: 'ckad-button',
  template: '',
})
class MockCkadButtonComponent {}

@Component({
  selector: 'ckad-button-raised',
  template: '',
})
class MockCkadButtonRaisedComponent {}

@Component({
  selector: 'ckad-mutable-list',
  template: '',
})
class MockCkadMutableListComponent {}

@Component({
  selector: 'ckad-mutable-list-item',
  template: '',
})
class MockCkadMutableListItemComponent {}

@Component({
  selector: 'overckd-recipe-input-source',
  template: '',
})
class MockRecipeInputSourceComponent {}

describe('RecipeInputSourcesListComponent', () => {
  let component: RecipeInputSourcesListComponent;
  let fixture: ComponentFixture<RecipeInputSourcesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        RecipeInputSourcesListComponent,
        // Mocked
        MockFontawesomeIconComponent,
        MockCkadButtonComponent,
        MockCkadButtonRaisedComponent,
        MockCkadMutableListComponent,
        MockCkadMutableListItemComponent,
        MockRecipeInputSourceComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeInputSourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
