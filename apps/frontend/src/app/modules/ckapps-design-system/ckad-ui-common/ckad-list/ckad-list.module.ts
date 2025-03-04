import { NgModule } from '@angular/core';
import { CkadListItemComponent } from './components/list-item/list-item.component';
import { CkadListComponent } from './components/list/list.component';
import { CkadMutableListItemComponent } from './components/mutable-list-item/mutable-list-item.component';
import { CkadMutableListComponent } from './components/mutable-list/mutable-list.component';

/**
 * **ckapps design/module**
 *
 * Module containing list related components
 */
@NgModule({
  imports: [
    CkadListComponent,
    CkadListItemComponent,
    CkadMutableListComponent,
    CkadMutableListItemComponent,
  ],
  exports: [
    CkadListComponent,
    CkadListItemComponent,
    CkadMutableListComponent,
    CkadMutableListItemComponent,
  ],
})
export class CkadListModule {}
