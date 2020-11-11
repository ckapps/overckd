import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RecipeCollection } from '@overckd/domain';

import { UrlBuilderService } from './url-builder.service';
import { RecipeCollectionService } from '../modules/domain/recipe-collection/services/recipe-collection.service';

/**
 * Service to retrieve collections from the API
 */
@Injectable()
export class AppRecipeCollectionService implements RecipeCollectionService {
  private readonly apiResource = 'collections';

  private readonly latestcollections$ = new BehaviorSubject<RecipeCollection[]>(
    [],
  );

  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
  ) {}

  public get collections$() {
    return this.latestcollections$.asObservable();
  }

  getAll(): Observable<RecipeCollection[]> {
    return this.http
      .get<RecipeCollection[]>(this.urlBuilder.url(this.apiResource))
      .pipe(tap(collections => this.latestcollections$.next(collections)));
  }

  getById(id: string): Observable<RecipeCollection> {
    return this.http.get<RecipeCollection>(
      this.urlBuilder.urlFromSegments([this.apiResource, id]),
    );
  }

  add(collection: RecipeCollection): Observable<RecipeCollection> {
    // TODO: request and update collections
    throw new Error('Method not implemented.');
  }

  removeById(id: string): Observable<boolean> {
    // TODO: request and update collections
    throw new Error('Method not implemented.');
  }

  update(
    collection: RecipeCollection,
    id: string,
  ): Observable<RecipeCollection> {
    // TODO: request and update collections
    throw new Error('Method not implemented.');
  }
}
