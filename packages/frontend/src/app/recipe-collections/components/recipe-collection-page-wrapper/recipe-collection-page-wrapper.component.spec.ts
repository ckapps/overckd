import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCollectionPageWrapperComponent } from './recipe-collection-page-wrapper.component';

describe('RecipeCollectionPageWrapperComponent', () => {
  let component: RecipeCollectionPageWrapperComponent;
  let fixture: ComponentFixture<RecipeCollectionPageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCollectionPageWrapperComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCollectionPageWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
