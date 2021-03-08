import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { IngredientTag, IngredientTagQuery } from '@overckd/domain';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, pluck, switchMap } from 'rxjs/operators';

import { IngredientTagService } from '../../../ingredient-common/services/ingredient-tag.service';
import { IngredientService } from '../../../ingredient-common/services/ingredient.service';

function isString(s: any): s is string {
  return typeof s === 'string';
}

@Component({
  selector: 'overckd-ingredient-shelf-filter',
  templateUrl: './ingredient-shelf-filter.component.html',
  styleUrls: ['./ingredient-shelf-filter.component.scss'],
})
export class IngredientShelfFilterComponent {
  @Input() selectable = true;
  @Input() removable = true;

  visible = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputCtrl = new FormControl();

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  private searchLabelSubject = new Subject<string>();
  private ingredientTagSubject = new BehaviorSubject<IngredientTag[]>([]);

  public selectedTags$ = this.ingredientTagSubject.asObservable();

  private selectedTagUris$ = this.selectedTags$.pipe(
    map(items => items.map(t => t.uri)),
  );

  private searchLabel$ = this.searchLabelSubject.pipe(filter(isString));

  private searchName$ = this.inputCtrl.valueChanges.pipe(
    debounceTime(300),
    filter(isString),
  );

  private ingredientTagQuery$: Observable<
    IngredientTagQuery
  > = this.searchName$.pipe(map(label => ({ query: { label } })));

  /**
   * Query for fetching ingredients
   */
  private ingredientQuery$ = combineLatest([
    this.searchLabel$,
    this.selectedTagUris$,
  ]).pipe(map(([name, tags]) => ({ query: { name, tags } })));

  /**
   * Filtered ingredients
   */
  public filteredIngredients$ = this.ingredientQuery$.pipe(
    switchMap(query => this.ingredientService.findByQuery(query)),
    pluck('result'),
  );

  /**
   * Filtered ingredients
   */
  public filteredTags$ = this.ingredientTagQuery$.pipe(
    switchMap(query => this.ingredientTagService.findByQuery(query)),
    pluck('result'),
  );

  constructor(
    private ingredientService: IngredientService,
    private ingredientTagService: IngredientTagService,
  ) {}

  add(event: MatChipInputEvent): void {
    const value = event.value;

    this.searchLabelSubject.next(value);
  }

  remove(tag: IngredientTag): void {
    const index = this.ingredientTagSubject.value.indexOf(tag);

    if (index >= 0) {
      this.ingredientTagSubject.next(
        this.ingredientTagSubject.value.filter((_, i) => i !== index),
      );
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const {
      option: { value },
    } = event;

    this.ingredientTagSubject.next([...this.ingredientTagSubject.value, value]);
    this.inputCtrl.setValue(null);
    this.fruitInput.nativeElement.value = '';
  }
}
