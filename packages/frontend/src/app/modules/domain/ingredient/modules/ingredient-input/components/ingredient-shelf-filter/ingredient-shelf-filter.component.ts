import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent } from '@angular/material/legacy-autocomplete';
import {
  MatLegacyChipInputEvent as MatChipInputEvent,
  MatLegacyChipSelectionChange as MatChipSelectionChange,
} from '@angular/material/legacy-chips';
import { IngredientQuery, Tag, TagQuery } from '@overckd/domain';
import { isString } from '@overckd/domain/dist/core/string';
import {
  switchMapFilterFromUris,
  mapToUriArray,
} from '@overckd/domain/dist/rxjs/uri';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  pluck,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { TagService } from '../../../../../tag/modules/tag-common/services/tag.service';

@Component({
  selector: 'overckd-ingredient-shelf-filter',
  templateUrl: './ingredient-shelf-filter.component.html',
  styleUrls: ['./ingredient-shelf-filter.component.scss'],
})
export class IngredientShelfFilterComponent implements OnDestroy {
  private destroyed$ = new ReplaySubject<boolean>(1);
  private tagSubject = new BehaviorSubject<Tag[]>([]);

  @Input() selectable = true;
  @Input() removable = true;

  /**
   * Emits when the user adds an ingredient
   */
  @Output() added = new EventEmitter<string>();

  /**
   * Emits when the query information did change
   */
  @Output() queryChanged = new EventEmitter<IngredientQuery>();

  visible = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  inputCtrl = new UntypedFormControl();

  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

  /**
   * Observable that emits with the selected tags
   */
  public selectedTags$ = this.tagSubject.asObservable();

  /**
   * Observable that emits with the URIs of the selected tags
   */
  private selectedTagUris$ = this.selectedTags$.pipe(mapToUriArray());

  /**
   * Observable that emits the entered search query
   */
  private searchName$ = this.inputCtrl.valueChanges.pipe(
    debounceTime(300),
    filter(isString),
  );

  /**
   * Observable that emits
   */
  private tagQuery$: Observable<TagQuery> = this.searchName$.pipe(
    map(label => ({ query: { label } })),
  );

  /**
   * Filtered ingredients
   */
  public filteredTags$ = this.tagQuery$.pipe(
    switchMap(query => this.tagService.findByQuery(query)),
    pluck('result'),
    switchMapFilterFromUris(this.selectedTagUris$),
  );

  /**
   * Observable that emits with the query
   * represented by the state of this control
   */
  private ingredientQuery$ = combineLatest([
    this.searchName$,
    this.selectedTagUris$,
  ]).pipe(map(([name, tags]) => ({ query: { name, tags } })));

  constructor(private tagService: TagService) {
    this.ingredientQuery$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(query => this.queryChanged.emit(query));
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  add(event: MatChipInputEvent): void {
    const value = event.value;

    this.added.emit(value);
    this.resetInput();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const {
      option: { value },
    } = event;

    this.addTag(value);
  }

  public onTagselectionChange(ev: MatChipSelectionChange, tag: Tag) {
    if (ev.selected) {
      this.addTag(tag);
    }
  }

  /**
   * Adds tag to selection
   *
   * @param tag Tag to add
   */
  public addTag(tag: Tag) {
    this.tagSubject.next([...this.tagSubject.value, tag]);
    this.resetInput();
  }

  /**
   * Removes tag from selection
   * @param tag Tag to remove
   */
  public removeTag(tag: Tag) {
    const index = this.tagSubject.value.indexOf(tag);

    if (index >= 0) {
      this.tagSubject.next(this.tagSubject.value.filter((_, i) => i !== index));
    }
  }

  private resetInput() {
    this.inputCtrl.setValue(null);
    this.searchInput.nativeElement.value = '';
  }
}
