import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
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
        MatInputModule,
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
      teardown: { destroyAfterEach: false },
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
