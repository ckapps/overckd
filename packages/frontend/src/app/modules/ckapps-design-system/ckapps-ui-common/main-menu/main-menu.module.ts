import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External submodules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Module components
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MainMenuItemComponent } from './components/main-menu-item/main-menu-item.component';
import { MainMenuGroupComponent } from './components/main-menu-group/main-menu-group.component';

@NgModule({
  declarations: [
    MainMenuComponent,
    MainMenuItemComponent,
    MainMenuGroupComponent,
  ],
  imports: [CommonModule, FontAwesomeModule],
  exports: [MainMenuComponent, MainMenuItemComponent, MainMenuGroupComponent],
})
export class MainMenuModule {}
