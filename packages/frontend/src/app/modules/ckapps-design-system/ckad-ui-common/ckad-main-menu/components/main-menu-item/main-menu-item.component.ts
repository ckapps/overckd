import { Component, Input, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

/**
 * Component for displaying the menu item
 */
@Component({
  selector: 'ckad-main-menu-item',
  templateUrl: './main-menu-item.component.html',
  styleUrls: ['./main-menu-item.component.scss'],
})
export class CkadMainMenuItemComponent implements OnInit {
  @Input() icon: IconProp;

  constructor() {}

  ngOnInit(): void {}
}
