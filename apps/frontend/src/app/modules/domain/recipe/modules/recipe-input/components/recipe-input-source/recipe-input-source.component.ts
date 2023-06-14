import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecipeBaseLink } from '@overckd/domain';

type SourceType = 'url';

@Component({
  selector: 'overckd-recipe-input-source',
  templateUrl: './recipe-input-source.component.html',
  styleUrls: ['./recipe-input-source.component.scss'],
})
export class RecipeInputSourceComponent implements OnInit {
  @Output() itemChanged = new EventEmitter<RecipeBaseLink>();

  private sourceType: SourceType = 'url';
  private _url: RecipeBaseLink = '';

  public get url() {
    return this._url;
  }

  public set url(value) {
    this._url = value;
    this.propagteItemChange(value);
  }

  @Input()
  get value(): RecipeBaseLink | null {
    switch (this.sourceType) {
      case 'url':
        return this.url;
      default:
        return null;
    }
  }

  set value(newValue: RecipeBaseLink | null) {
    switch (this.sourceType) {
      case 'url':
        this._url = newValue ?? '';
    }
  }

  ngOnInit(): void {}

  propagteItemChange(item: RecipeBaseLink) {
    this.itemChanged.emit(item);
  }
}
