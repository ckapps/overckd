import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientGroupComponent } from './ingredient-group.component';

describe('IngredientGroupComponent', () => {
  let component: IngredientGroupComponent;
  let fixture: ComponentFixture<IngredientGroupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IngredientGroupComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
