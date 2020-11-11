import { Component, OnInit } from '@angular/core';
import {
  faFileContract,
  faHome,
  faUtensils,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-app-main-menu',
  templateUrl: './app-main-menu.component.html',
  styleUrls: ['./app-main-menu.component.scss'],
})
export class AppMainMenuComponent implements OnInit {
  public faHome = faHome;
  public faUtensils = faUtensils;
  public faFileContract = faFileContract;
  public faWallet = faWallet;

  constructor() {}

  ngOnInit(): void {}
}
