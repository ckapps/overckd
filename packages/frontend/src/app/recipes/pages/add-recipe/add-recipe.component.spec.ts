import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipePageComponent } from './add-recipe.component';

describe('AddRecipeComponent', () => {
  let component: AddRecipePageComponent;
  let fixture: ComponentFixture<AddRecipePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRecipePageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecipePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
