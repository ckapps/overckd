import { Component, HostBinding, Input, OnInit } from '@angular/core';
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
  @HostBinding('class.list-group-item') cssListGroupItem = true;
  @HostBinding('class.list-group-item-action') cssListGroupItemAction = true;
  @HostBinding('class.rounded-0') cssNoBorderRadius = true;
  @HostBinding('class.border-0') cssNoBorder = true;
  // @HostBinding('class.bg-transparent') cssBackgroundTransparent = true;
  // @HostBinding('class.text-light') cssTextLight = true;

  @Input() icon: IconProp;

  constructor() {}

  ngOnInit(): void {}
}
