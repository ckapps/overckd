import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  CkadMainMenuGroupComponent,
  CkadMainMenuItemComponent,
} from '@ckapp/ckad-angular/main-menu';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { RecipeCollectionService } from '../../services/recipe-collection.service';

@Component({
  selector: 'overckd-collections-main-menu-group',
  templateUrl: './collections-main-menu-group.component.html',
  styleUrls: ['./collections-main-menu-group.component.scss'],
  imports: [
    CkadMainMenuGroupComponent,
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    CkadMainMenuItemComponent,
    AsyncPipe,
  ],
})
export class CollectionsMainMenuGroupComponent {
  readonly #recipeCollectionService = inject(RecipeCollectionService);

  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faListAlt = faListAlt;
  public collections$ = this.#recipeCollectionService.collections$;
}
