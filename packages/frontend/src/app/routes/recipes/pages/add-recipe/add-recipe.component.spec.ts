import { Component, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AddRecipePageComponent } from './add-recipe.component';

class NoopValueAccessor {
  writeValue(obj: any): void {
    // throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    // throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }
}

@Component({
  selector: 'ckad-input-field',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockCkadInputFieldComponent),
      multi: true,
    },
  ],
})
class MockCkadInputFieldComponent extends NoopValueAccessor {}

@Component({
  selector: 'overckd-recipe-input-sources-list',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockRecipeInputSourcesListComponent),
      multi: true,
    },
  ],
})
class MockRecipeInputSourcesListComponent extends NoopValueAccessor {}

@Component({
  selector: 'overckd-portion-quantifier-input',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockPortionQuantifierInputComponent),
      multi: true,
    },
  ],
})
class MockPortionQuantifierInputComponent extends NoopValueAccessor {}

@Component({
  selector: 'overckd-ingredient-list-input',
  template: '',
})
class MockIngredientListInputComponent {}

describe('AddRecipeComponent', () => {
  let component: AddRecipePageComponent;
  let fixture: ComponentFixture<AddRecipePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddRecipePageComponent,
        // Mocks
        MockCkadInputFieldComponent,
        MockRecipeInputSourcesListComponent,
        MockIngredientListInputComponent,
        MockPortionQuantifierInputComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatStepperModule,
        NoopAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      teardown: { destroyAfterEach: false },
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
