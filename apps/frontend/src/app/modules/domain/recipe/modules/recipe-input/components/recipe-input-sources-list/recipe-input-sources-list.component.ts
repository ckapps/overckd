import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { RecipeBaseLink } from '@overckd/domain';
import * as Fn from 'effect/Function';
import { BehaviorSubject, map, Subject, switchMap, tap } from 'rxjs';

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
  @Input() label!: string;

  private _value!: RecipeBaseLink[];

  public iconLink = faLink;

  public get items(): RecipeBaseLink[] {
    return this.itemsSubject.value;
  }

  private addItem$ = new Subject<void>();

  private isAddingSubject = new BehaviorSubject<boolean>(false);
  public isAdding$ = this.isAddingSubject.asObservable();

  private newItemSubject = new Subject<RecipeBaseLink>();
  public newItem$ = this.newItemSubject.asObservable();

  private itemsSubject = new BehaviorSubject<RecipeBaseLink[]>([]);
  public items$ = this.itemsSubject.asObservable();

  public newItems$ = this.newItem$.pipe(
    switchMap(newItem => this.addItem$.pipe(map(() => newItem))),
    tap(newItem => this.addItem(newItem)),
    tap(() => this.newItemSubject.next('')),
  );

  private _onChange: (v: unknown) => void = Fn.constVoid;
  private _onTouched: () => void = Fn.constVoid;

  private addItem(item: RecipeBaseLink) {
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

  onNewItemChanged(item: RecipeBaseLink) {
    this.newItemSubject.next(item);
  }

  onAddClicked() {
    this.addItem$.next();
  }
}
