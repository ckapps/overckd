import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
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
      providers: [
        provideNoopAnimations(),
        {
          provide: IngredientService,
          useValue: mockIngredientService,
        },
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
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
