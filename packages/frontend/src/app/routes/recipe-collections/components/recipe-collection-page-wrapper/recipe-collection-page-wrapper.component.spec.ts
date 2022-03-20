import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RecipeCollectionPageWrapperComponent } from './recipe-collection-page-wrapper.component';

@Component({
  selector: 'ocui-page',
  template: '',
})
export class MockPageComponent {}

describe('RecipeCollectionPageWrapperComponent', () => {
  let component: RecipeCollectionPageWrapperComponent;
  let fixture: ComponentFixture<RecipeCollectionPageWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecipeCollectionPageWrapperComponent,
        // Mocks
        MockPageComponent,
      ],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
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
