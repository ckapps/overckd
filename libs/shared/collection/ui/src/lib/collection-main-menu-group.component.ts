import { Component, input } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  CkadMainMenuGroupComponent,
  CkadMainMenuItemComponent,
} from '@ckapp/angular/main-menu';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { RecipeCollection } from '@overckd/domain';

@Component({
  selector: 'overckd-collection-main-menu-group',
  templateUrl: './collection-main-menu-group.component.html',
  imports: [
    CkadMainMenuGroupComponent,
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    CkadMainMenuItemComponent,
  ],
})
export class CollectionMainMenuGroupComponent {
  readonly collections = input.required<ReadonlyArray<RecipeCollection>>();

  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faListAlt = faListAlt;
}
