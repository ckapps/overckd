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
  ],
})
export class CollectionsMainMenuGroupComponent {
  readonly collections = input.required<ReadonlyArray<RecipeCollection>>();

  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faListAlt = faListAlt;
}
