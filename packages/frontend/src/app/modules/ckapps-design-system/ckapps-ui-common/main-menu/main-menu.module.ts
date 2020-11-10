import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External submodules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Module components
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MainMenuItemComponent } from './components/main-menu-item/main-menu-item.component';

@NgModule({
  declarations: [MainMenuComponent, MainMenuItemComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [MainMenuComponent, MainMenuItemComponent],
})
export class MainMenuModule {}
