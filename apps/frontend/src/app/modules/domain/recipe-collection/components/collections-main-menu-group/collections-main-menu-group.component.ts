import { Component, OnDestroy } from '@angular/core';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { ReplaySubject } from 'rxjs';
import { RecipeCollectionService } from '../../services/recipe-collection.service';

@Component({
  selector: 'overckd-collections-main-menu-group',
  templateUrl: './collections-main-menu-group.component.html',
  styleUrls: ['./collections-main-menu-group.component.scss'],
})
export class CollectionsMainMenuGroupComponent implements OnDestroy {
  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faListAlt = faListAlt;
  public collections$ = this.recipeCollectionService.collections$;

  private destroyed$ = new ReplaySubject(1);

  constructor(private recipeCollectionService: RecipeCollectionService) {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
