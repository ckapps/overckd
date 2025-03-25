import { SharedUiModule } from '@_shared/ui';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import {
  faFileContract,
  faHome,
  faPlusCircle,
  faUtensils,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { CkadUiCommonModule } from '../../modules/ckapps-design-system/ckad-ui-common/ckad-ui-common.module';
import { RecipeCollectionModule } from '../../modules/domain/recipe-collection/recipe-collection.module';

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
    RecipeCollectionModule,
    CkadUiCommonModule,
    SharedUiModule,
  ],
})
export class AppMainMenuComponent {
  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faHome = faHome;
  public faUtensils = faUtensils;
  public faFileContract = faFileContract;
  public faWallet = faWallet;
  public iconAdd = faPlusCircle;
}
