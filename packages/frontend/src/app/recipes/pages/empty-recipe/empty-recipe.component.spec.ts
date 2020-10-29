import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyRecipePageComponent } from './empty-recipe.component';

describe('EmptyComponent', () => {
  let component: EmptyRecipePageComponent;
  let fixture: ComponentFixture<EmptyRecipePageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmptyRecipePageComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyRecipePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
