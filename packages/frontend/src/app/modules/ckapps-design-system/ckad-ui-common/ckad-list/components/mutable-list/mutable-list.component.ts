import {
  AfterContentInit,
  Component,
  ContentChildren,
  OnInit,
} from '@angular/core';

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
export class CkadMutableListComponent implements OnInit, AfterContentInit {
  @ContentChildren(CkadMutableListItemComponent)
  private itemContentChildren: CkadMutableListItemComponent[];

  constructor() {}

  ngOnInit(): void {}

  ngAfterContentInit() {
    console.log('itemContentChildren', this.itemContentChildren);
  }
}
