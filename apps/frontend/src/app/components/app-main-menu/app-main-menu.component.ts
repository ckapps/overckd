import { SharedUiModule } from '@_shared/ui';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { RecipeCollectionModule } from '../../modules/domain/recipe-collection/recipe-collection.module';
import { RecipeCollectionService } from '../../modules/domain/recipe-collection/services/recipe-collection.service';

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
    CkadMainMenuModule,
    SharedUiModule,
  ],
})
export class AppMainMenuComponent {
  readonly #recipeCollectionService = inject(RecipeCollectionService);

  protected readonly collections = toSignal(
    this.#recipeCollectionService.collections$,
    {
      initialValue: [],
    },
  );

  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faHome = faHome;
  public faUtensils = faUtensils;
  public faFileContract = faFileContract;
  public faWallet = faWallet;
  public iconAdd = faPlusCircle;
}
