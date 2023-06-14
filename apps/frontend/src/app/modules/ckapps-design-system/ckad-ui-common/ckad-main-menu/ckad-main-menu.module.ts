import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';

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
  imports: [CommonModule, FontAwesomeModule, MatExpansionModule, MatListModule],
  exports: [
    CkadMainMenuComponent,
    CkadMainMenuItemComponent,
    CkadMainMenuGroupComponent,
  ],
})
export class CkadMainMenuModule {}
