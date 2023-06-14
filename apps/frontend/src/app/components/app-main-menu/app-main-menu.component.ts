import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import {
  faFileContract,
  faHome,
  faPlusCircle,
  faUtensils,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { RecipeCollectionModule } from '../../modules/domain/recipe-collection/recipe-collection.module';
import { UiModule } from '../../modules/ui/ui.module';

/**
 * Component that displays the apps
 * main menu
 */
@Component({
  standalone: true,
  selector: 'app-main-menu',
  templateUrl: './app-main-menu.component.html',
  styleUrls: ['./app-main-menu.component.scss'],
  imports: [MatListModule, RouterModule, RecipeCollectionModule, UiModule],
})
export class AppMainMenuComponent implements OnInit {
  readonly itemClass = 'ckapps-main-menu-item';
  readonly itemActiveClass = 'ckapps-main-menu-item--active';
  public faHome = faHome;
  public faUtensils = faUtensils;
  public faFileContract = faFileContract;
  public faWallet = faWallet;
  public iconAdd = faPlusCircle;

  constructor() {}

  ngOnInit(): void {}
}
