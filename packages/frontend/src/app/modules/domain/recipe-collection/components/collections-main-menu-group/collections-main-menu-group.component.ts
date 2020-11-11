import { Component, OnDestroy, OnInit } from '@angular/core';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RecipeCollection } from '@overckd/domain';

import { RecipeCollectionService } from '../../services/recipe-collection.service';

@Component({
  selector: 'overckd-collections-main-menu-group',
  templateUrl: './collections-main-menu-group.component.html',
  styleUrls: ['./collections-main-menu-group.component.scss'],
})
export class CollectionsMainMenuGroupComponent implements OnInit, OnDestroy {
  public faListAlt = faListAlt;
  public collections$: Observable<RecipeCollection[]>;

  private destroyed$ = new ReplaySubject(1);

  constructor(private recipeCollectionService: RecipeCollectionService) {
    // Keep collections up to date
    this.collections$ = this.recipeCollectionService.collections$;
  }

  ngOnInit(): void {
    // Make an initial request to the collections
    this.recipeCollectionService
      .getAll()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
