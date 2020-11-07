import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesPagesComponent } from './recipes.component';

describe('RecipesComponent', () => {
  let component: RecipesPagesComponent;
  let fixture: ComponentFixture<RecipesPagesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RecipesPagesComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
