import { Component, input } from '@angular/core';
import { WindowNavigationButtonsComponent } from '../window-navigation-buttons/window-navigation-buttons.component';

@Component({
  selector: 'ckad-desktop-window-title-bar',
  templateUrl: './window-title-bar.component.html',
  styleUrls: ['./window-title-bar.component.scss'],
  imports: [WindowNavigationButtonsComponent],
})
export class WindowTitleBarComponent {
  readonly title = input('');
}
