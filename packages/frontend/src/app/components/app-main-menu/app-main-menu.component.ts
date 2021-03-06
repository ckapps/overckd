import { Component, OnInit } from '@angular/core';
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
})
export class AppMainMenuComponent implements OnInit {
  public faHome = faHome;
  public faUtensils = faUtensils;
  public faFileContract = faFileContract;
  public faWallet = faWallet;
  public iconAdd = faPlusCircle;

  constructor() {}

  ngOnInit(): void {}
}
