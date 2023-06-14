import { AfterContentInit, Component, ContentChildren } from '@angular/core';
import { CkadMutableListItemComponent } from '../mutable-list-item/mutable-list-item.component';

/**
 * **ckapps design/component**
 *
 * Component for displaying a mutable list with mutable list items
 */
@Component({
  selector: 'ckad-mutable-list',
  templateUrl: './mutable-list.component.html',
  styleUrls: ['./mutable-list.component.scss'],
})
export class CkadMutableListComponent implements AfterContentInit {
  @ContentChildren(CkadMutableListItemComponent)
  private itemContentChildren!: CkadMutableListItemComponent[];

  constructor() {}

  ngAfterContentInit() {
    console.log('itemContentChildren', this.itemContentChildren);
  }
}
