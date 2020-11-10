import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'ocui-main-menu-item',
  templateUrl: './main-menu-item.component.html',
  styleUrls: ['./main-menu-item.component.scss'],
})
export class MainMenuItemComponent implements OnInit {
  @HostBinding('class.list-group-item') cssListGroupItem = true;
  @HostBinding('class.list-group-item-action') cssListGroupItemAction = true;
  @HostBinding('class.rounded-0') cssNoBorderRadius = true;
  @HostBinding('class.border-0') cssNoBorder = true;
  // @HostBinding('class.bg-transparent') cssBackgroundTransparent = true;
  // @HostBinding('class.text-light') cssTextLight = true;

  @Input() icon: IconDefinition;
  @Input() text: string;

  constructor() {}

  ngOnInit(): void {}
}
