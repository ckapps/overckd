import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EMPTY } from 'rxjs';

import { TagService } from '../../../../../tag/modules/tag-common/services/tag.service';
import { IngredientService } from '../../../ingredient-common/services/ingredient.service';

import { IngredientShelfFilterComponent } from './ingredient-shelf-filter.component';

@Component({
  selector: 'fa-icon',
  template: '',
})
class MockFontawesomeIconComponent {}

describe('IngredientShelfFilterComponent', () => {
  let component: IngredientShelfFilterComponent;
  let fixture: ComponentFixture<IngredientShelfFilterComponent>;

  const mockIngredientService = {
    findByQuery: jest.fn().mockReturnValue(EMPTY),
  };
  const mockTagService = {
    findByQuery: jest.fn().mockReturnValue(EMPTY),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IngredientShelfFilterComponent,
        // Mocked
        MockFontawesomeIconComponent,
      ],
      imports: [
        NoopAnimationsModule,
        // Forms modules
        FormsModule,
        ReactiveFormsModule,
        // Material modules
        MatAutocompleteModule,
        MatChipsModule,
        MatFormFieldModule,
        MatListModule,
      ],
      providers: [
        {
          provide: IngredientService,
          useValue: mockIngredientService,
        },
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientShelfFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
