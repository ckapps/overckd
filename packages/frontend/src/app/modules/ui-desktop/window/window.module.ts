import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Module components
import { WindowNavigationButtonsComponent } from './components/window-navigation-buttons/window-navigation-buttons.component';
import { WindowTitleBarComponent } from './components/window-title-bar/window-title-bar.component';
import { IconsModule } from '../../ui/icons/icons.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [WindowTitleBarComponent, WindowNavigationButtonsComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [WindowTitleBarComponent],
})
export class WindowModule {}
