import { injectCollectionQueries } from '@overckd-app/collection/data-access';
import { CollectionMainMenuGroupComponent } from '@overckd-app/collection/ui';
import { SharedUiModule } from '@overckd-app/ui';
import { Component, computed } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CkadMainMenuModule } from '@ckapp/angular/main-menu';
import {
  faFileContract,
  faHome,
  faPlusCircle,
  faUtensils,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Component that displays the apps
 * main menu
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './app-main-menu.component.html',
  styleUrls: ['./app-main-menu.component.scss'],
  imports: [
    MatListModule,
    RouterModule,
    CollectionMainMenuGroupComponent,
    CkadMainMenuModule,
    SharedUiModule,
  ],
})
export class AppMainMenuComponent {
  readonly #collections = injectCollectionQueries().getAll();

  /** The collections, or none while they load or when they failed to load */
  protected readonly collections = computed(() =>
    this.#collections.hasValue() ? this.#collections.value() : [],
  );

  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faHome = faHome;
  public faUtensils = faUtensils;
  public faFileContract = faFileContract;
  public faWallet = faWallet;
  public iconAdd = faPlusCircle;
}
