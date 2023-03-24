import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyRecipePageComponent } from './empty-recipe.component';

@Component({
  selector: 'overckd-recipe',
  template: '',
})
class MockRecipeComponent {}

describe('EmptyComponent', () => {
  let component: EmptyRecipePageComponent;
  let fixture: ComponentFixture<EmptyRecipePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [
        EmptyRecipePageComponent,
        // Mocked
        MockRecipeComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyRecipePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
