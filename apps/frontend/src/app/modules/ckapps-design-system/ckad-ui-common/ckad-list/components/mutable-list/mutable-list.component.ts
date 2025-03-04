import { AfterContentInit, Component, contentChildren } from '@angular/core';
import { CkadMutableListItemComponent } from '../mutable-list-item/mutable-list-item.component';
import { CkadListComponent } from '../list/list.component';

/**
 * **ckapps design/component**
 *
 * Component for displaying a mutable list with mutable list items
 */
@Component({
  selector: 'ckad-mutable-list',
  templateUrl: './mutable-list.component.html',
  styleUrls: ['./mutable-list.component.scss'],
  imports: [CkadListComponent],
})
export class CkadMutableListComponent implements AfterContentInit {
  readonly itemContentChildren = contentChildren(CkadMutableListItemComponent);

  ngAfterContentInit() {
    console.log('itemContentChildren', this.itemContentChildren());
  }
}
