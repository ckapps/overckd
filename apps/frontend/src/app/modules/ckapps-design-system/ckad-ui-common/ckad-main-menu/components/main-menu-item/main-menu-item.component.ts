import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

/**
 * Component for displaying the menu item
 */
@Component({
  selector: 'ckad-main-menu-item',
  templateUrl: './main-menu-item.component.html',
  styleUrls: ['./main-menu-item.component.scss'],
  imports: [FontAwesomeModule],
})
export class CkadMainMenuItemComponent {
  readonly icon = input<IconProp>();
}
