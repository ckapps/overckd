import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Required modules
import { IconsModule } from '../icons/icons.module';

// Module components
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MainMenuItemComponent } from './components/main-menu-item/main-menu-item.component';

@NgModule({
  declarations: [MainMenuComponent, MainMenuItemComponent],
  imports: [CommonModule, IconsModule],
  exports: [MainMenuComponent, MainMenuItemComponent],
})
export class MainMenuModule {}
