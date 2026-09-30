import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RecipeCollection } from '@overckd/domain';
import { Observable, share } from 'rxjs';
import { RecipeCollectionService } from '../modules/domain/recipe-collection/services/recipe-collection.service';
import { UrlBuilderService } from './url-builder.service';

/**
 * Service to retrieve collections from the API
 */
@Injectable()
export class AppRecipeCollectionService implements RecipeCollectionService {
  readonly #urlBuilder = inject(UrlBuilderService);
  readonly #http = inject(HttpClient);

  readonly #apiResource = 'collections';

  readonly #apiEndpoint = this.#urlBuilder.url(this.#apiResource);

  readonly #fetchCollections$ = this.#http.get<RecipeCollection[]>(
    this.#apiEndpoint,
  );

  public readonly collections$ = this.#fetchCollections$.pipe(share());

  getAll(): Observable<RecipeCollection[]> {
    return this.collections$;
  }

  getById(id: string): Observable<RecipeCollection> {
    return this.#http.get<RecipeCollection>(
      this.#urlBuilder.urlFromSegments([this.#apiResource, id]),
    );
  }
}
