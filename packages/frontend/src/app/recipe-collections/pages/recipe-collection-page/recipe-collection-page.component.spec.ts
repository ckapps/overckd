import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCollectionPageComponent } from './recipe-collection-page.component';

describe('RecipeCollectionPageComponent', () => {
  let component: RecipeCollectionPageComponent;
  let fixture: ComponentFixture<RecipeCollectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCollectionPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCollectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
