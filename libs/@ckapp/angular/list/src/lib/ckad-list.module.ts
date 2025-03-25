import { NgModule } from '@angular/core';
import { CkadListItemComponent } from './list-item.component';
import { CkadListComponent } from './list.component';
import { CkadMutableListItemComponent } from './mutable-list-item.component';
import { CkadMutableListComponent } from './mutable-list.component';

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
