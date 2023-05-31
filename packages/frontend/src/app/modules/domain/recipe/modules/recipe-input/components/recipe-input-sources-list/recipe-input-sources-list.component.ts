import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { Recipe } from '@overckd/domain';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

type RecipeBasedOn = Recipe['basedOn'][0];

/**
 * Input component for recipes based-on list
 */
@Component({
  selector: 'overckd-recipe-input-sources-list',
  templateUrl: './recipe-input-sources-list.component.html',
  styleUrls: ['./recipe-input-sources-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecipeInputSourcesListComponent),
      multi: true,
    },
  ],
})
export class RecipeInputSourcesListComponent
  implements OnInit, ControlValueAccessor
{
  @Input() label: string;

  private _value: RecipeBasedOn[];

  public iconLink = faLink;

  public get items(): RecipeBasedOn[] {
    return this.itemsSubject.value;
  }

  private addItem$ = new Subject<void>();

  private isAddingSubject = new BehaviorSubject<boolean>(false);
  public isAdding$ = this.isAddingSubject.asObservable();

  private newItemSubject = new Subject<RecipeBasedOn>();
  public newItem$ = this.newItemSubject.asObservable();

  private itemsSubject = new BehaviorSubject<RecipeBasedOn[]>([]);
  public items$ = this.itemsSubject.asObservable();

  public newItems$ = this.newItem$.pipe(
    switchMap(newItem => this.addItem$.pipe(map(() => newItem))),
    tap(newItem => this.addItem(newItem)),
    tap(() => this.newItemSubject.next('')),
  );

  private _onChange: (v: unknown) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor() {}

  private addItem(item: RecipeBasedOn) {
    this.itemsSubject.next([...this.itemsSubject.value, item]);
  }

  ngOnInit(): void {
    this.newItems$.subscribe(x => {
      // TODO implement
    });
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this._value = obj;
    } else {
      this._value = [];
    }

    this.itemsSubject.next(this._value);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  // setDisabledState?(isDisabled: boolean): void {
  //   throw new Error('Method not implemented.');
  // }

  onOpenAddViewClicked() {
    this.isAddingSubject.next(true);
  }

  onCancelAddClicked() {
    this.isAddingSubject.next(false);
  }

  onNewItemChanged(item: RecipeBasedOn) {
    this.newItemSubject.next(item);
  }

  onAddClicked() {
    this.addItem$.next();
  }
}
