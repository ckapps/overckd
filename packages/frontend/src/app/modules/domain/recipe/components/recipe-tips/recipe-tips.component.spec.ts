import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeTipsComponent } from './recipe-tips.component';

describe('RecipeTipsComponent', () => {
  let component: RecipeTipsComponent;
  let fixture: ComponentFixture<RecipeTipsComponent>;

  let mockRecipe;

  beforeEach(() => {
    mockRecipe = {
      images: [],
      name: 'mock-name',
      ingredients: [],
      steps: [],
      tips: ['mock-tip-1', 'mock-tip-2'],
      styles: {},
    };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [RecipeTipsComponent],
    schemas: [NO_ERRORS_SCHEMA],
    teardown: { destroyAfterEach: false }
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeTipsComponent);
    component = fixture.componentInstance;
    // Set props
    component.recipe = mockRecipe;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
