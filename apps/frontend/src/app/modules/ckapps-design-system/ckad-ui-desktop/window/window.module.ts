import { NgModule } from '@angular/core';
import { WindowNavigationButtonsComponent } from './components/window-navigation-buttons/window-navigation-buttons.component';
import { WindowTitleBarComponent } from './components/window-title-bar/window-title-bar.component';

@NgModule({
  imports: [WindowTitleBarComponent, WindowNavigationButtonsComponent],
  exports: [WindowTitleBarComponent],
})
export class WindowModule {}
