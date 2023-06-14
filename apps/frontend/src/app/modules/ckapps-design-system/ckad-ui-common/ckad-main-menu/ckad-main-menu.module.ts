import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

// External submodules
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Module components
import { CkadMainMenuGroupComponent } from './components/main-menu-group/main-menu-group.component';
import { CkadMainMenuItemComponent } from './components/main-menu-item/main-menu-item.component';
import { CkadMainMenuComponent } from './components/main-menu/main-menu.component';

@NgModule({
  declarations: [
    CkadMainMenuComponent,
    CkadMainMenuItemComponent,
    CkadMainMenuGroupComponent,
  ],
  imports: [CommonModule, FontAwesomeModule, MatExpansionModule, MatListModule],
  exports: [
    CkadMainMenuComponent,
    CkadMainMenuItemComponent,
    CkadMainMenuGroupComponent,
  ],
})
export class CkadMainMenuModule {}
