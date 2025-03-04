import { AsyncPipe } from '@angular/common';
import { Component, forwardRef, input, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { RecipeBaseLink } from '@overckd/domain';
import * as Fn from 'effect/Function';
import { BehaviorSubject, map, Subject, switchMap, tap } from 'rxjs';
import { CkadButtonRaisedComponent } from '../../../../../../ckapps-design-system/ckad-ui-common/ckad-button/components/button-raised/button-raised.component';
import { CkadButtonButtonComponent } from '../../../../../../ckapps-design-system/ckad-ui-common/ckad-button/components/button/button.component';
import { CkadMutableListItemComponent } from '../../../../../../ckapps-design-system/ckad-ui-common/ckad-list/components/mutable-list-item/mutable-list-item.component';
import { CkadMutableListComponent } from '../../../../../../ckapps-design-system/ckad-ui-common/ckad-list/components/mutable-list/mutable-list.component';
import { RecipeInputSourceComponent } from '../recipe-input-source/recipe-input-source.component';

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
  imports: [
    CkadButtonRaisedComponent,
    CkadMutableListComponent,
    CkadMutableListItemComponent,
    FontAwesomeModule,
    RecipeInputSourceComponent,
    CkadButtonButtonComponent,
    AsyncPipe,
  ],
})
export class RecipeInputSourcesListComponent
  implements OnInit, ControlValueAccessor
{
  readonly label = input.required<string>();

  private _value!: RecipeBaseLink[];

  public iconLink = faLink;

  public get items(): RecipeBaseLink[] {
    return this.itemsSubject.value;
  }

  private addItem$ = new Subject<void>();

  private isAddingSubject = new BehaviorSubject<boolean>(false);
  public isAdding$ = this.isAddingSubject.asObservable();

  protected readonly newItem = signal<RecipeBaseLink>('');
  public newItem$ = toObservable(this.newItem);

  private itemsSubject = new BehaviorSubject<RecipeBaseLink[]>([]);
  public items$ = this.itemsSubject.asObservable();

  public newItems$ = this.newItem$.pipe(
    switchMap(newItem => this.addItem$.pipe(map(() => newItem))),
    tap(newItem => this.addItem(newItem)),
    tap(() => this.newItem.set('')),
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

  onAddClicked() {
    this.addItem$.next();
  }
}
