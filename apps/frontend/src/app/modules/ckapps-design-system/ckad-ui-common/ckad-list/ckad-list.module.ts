import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Module components
import { CkadListComponent } from './components/list/list.component';
import { CkadListItemComponent } from './components/list-item/list-item.component';
import { CkadMutableListComponent } from './components/mutable-list/mutable-list.component';
import { CkadMutableListItemComponent } from './components/mutable-list-item/mutable-list-item.component';

/**
 * **ckapps design/module**
 *
 * Module containing list related components
 */
@NgModule({
  declarations: [
    CkadListComponent,
    CkadListItemComponent,
    CkadMutableListComponent,
    CkadMutableListItemComponent,
  ],
  imports: [CommonModule],
  exports: [
    CkadListComponent,
    CkadListItemComponent,
    CkadMutableListComponent,
    CkadMutableListItemComponent,
  ],
})
export class CkadListModule {}
