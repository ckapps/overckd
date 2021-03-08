import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '@overckd/domain';

type RecipeBasedOn = Recipe['basedOn'][0];

type SourceType = 'url';

@Component({
  selector: 'overckd-recipe-input-source',
  templateUrl: './recipe-input-source.component.html',
  styleUrls: ['./recipe-input-source.component.scss'],
})
export class RecipeInputSourceComponent implements OnInit {
  @Output() itemChanged = new EventEmitter<RecipeBasedOn>();

  private sourceType: SourceType = 'url';
  private _url = '';

  public get url() {
    return this._url;
  }

  public set url(value) {
    this._url = value;
    this.propagteItemChange(value);
  }

  public get value(): RecipeBasedOn {
    switch (this.sourceType) {
      case 'url':
        return this.url;
      default:
        return undefined;
    }
  }

  @Input() public set value(newValue) {
    switch (this.sourceType) {
      case 'url':
        this._url = newValue;
    }
  }

  ngOnInit(): void {}

  propagteItemChange(item: RecipeBasedOn) {
    this.itemChanged.emit(item);
  }
}
