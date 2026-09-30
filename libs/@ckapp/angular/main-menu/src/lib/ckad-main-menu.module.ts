import { NgModule } from '@angular/core';
import { CkadMainMenuGroupComponent } from './main-menu-group/main-menu-group.component';
import { CkadMainMenuItemComponent } from './main-menu-item/main-menu-item.component';
import { CkadMainMenuComponent } from './main-menu/main-menu.component';

const DIRECTIVES = [
  CkadMainMenuComponent,
  CkadMainMenuGroupComponent,
  CkadMainMenuItemComponent,
];

@NgModule({
  imports: DIRECTIVES,
  exports: DIRECTIVES,
})
export class CkadMainMenuModule {}
