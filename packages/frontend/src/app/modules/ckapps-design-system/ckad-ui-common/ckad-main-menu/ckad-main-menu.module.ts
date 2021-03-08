import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// External submodules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Module components
import { CkadMainMenuComponent } from './components/main-menu/main-menu.component';
import { CkadMainMenuItemComponent } from './components/main-menu-item/main-menu-item.component';
import { CkadMainMenuGroupComponent } from './components/main-menu-group/main-menu-group.component';

@NgModule({
  declarations: [
    CkadMainMenuComponent,
    CkadMainMenuItemComponent,
    CkadMainMenuGroupComponent,
  ],
  imports: [CommonModule, FontAwesomeModule],
  exports: [
    CkadMainMenuComponent,
    CkadMainMenuItemComponent,
    CkadMainMenuGroupComponent,
  ],
})
export class CkadMainMenuModule {}
