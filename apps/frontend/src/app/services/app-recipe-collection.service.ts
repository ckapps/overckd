import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

import { RecipeCollection } from '@overckd/domain';

import { UrlBuilderService } from './url-builder.service';
import { RecipeCollectionService } from '../modules/domain/recipe-collection/services/recipe-collection.service';

/**
 * Service to retrieve collections from the API
 */
@Injectable()
export class AppRecipeCollectionService implements RecipeCollectionService {
  private readonly apiResource = 'collections';

  private apiEndpoint = this.urlBuilder.url(this.apiResource);

  private fetchCollections$ = this.http.get<RecipeCollection[]>(
    this.apiEndpoint,
  );

  public readonly collections$ = this.fetchCollections$.pipe(share());

  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
  ) {}

  getAll(): Observable<RecipeCollection[]> {
    return this.collections$;
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

  removeById(id: string): Observable<RecipeCollection> {
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
