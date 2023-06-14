import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WindowNavigationButtonsComponent } from './components/window-navigation-buttons/window-navigation-buttons.component';
import { WindowTitleBarComponent } from './components/window-title-bar/window-title-bar.component';

@NgModule({
  declarations: [WindowTitleBarComponent, WindowNavigationButtonsComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [WindowTitleBarComponent],
})
export class WindowModule {}
