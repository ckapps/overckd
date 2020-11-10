import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// Module components
import { WindowNavigationButtonsComponent } from './components/window-navigation-buttons/window-navigation-buttons.component';
import { WindowTitleBarComponent } from './components/window-title-bar/window-title-bar.component';

@NgModule({
  declarations: [WindowTitleBarComponent, WindowNavigationButtonsComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [WindowTitleBarComponent],
})
export class WindowModule {}
