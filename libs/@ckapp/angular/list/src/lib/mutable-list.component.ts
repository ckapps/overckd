import { AfterContentInit, Component, contentChildren } from '@angular/core';
import { CkadListComponent } from './list.component';
import { CkadMutableListItemComponent } from './mutable-list-item.component';

/**
 * **ckapps design/component**
 *
 * Component for displaying a mutable list with mutable list items
 */
@Component({
  selector: 'ckad-mutable-list',
  templateUrl: './mutable-list.component.html',
  imports: [CkadListComponent],
})
export class CkadMutableListComponent implements AfterContentInit {
  readonly itemContentChildren = contentChildren(CkadMutableListItemComponent);

  ngAfterContentInit() {
    console.log('itemContentChildren', this.itemContentChildren());
  }
}
