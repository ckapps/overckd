import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { RecipeCollectionService } from '../../services/recipe-collection.service';
import { CollectionsMainMenuGroupComponent } from './collections-main-menu-group.component';

describe('CollectionsMainMenuGroupComponent', () => {
  let component: CollectionsMainMenuGroupComponent;
  let fixture: ComponentFixture<CollectionsMainMenuGroupComponent>;

  const mockRecipeCollectionService = {
    collections$: EMPTY,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: RecipeCollectionService,
          useValue: mockRecipeCollectionService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsMainMenuGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
