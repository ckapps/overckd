import { Injectable } from '@angular/core';
import { RecipeCollection } from '@overckd/domain';
import { RecipeCollectionRepository } from '@overckd/domain/dist/repositories';
import { Observable } from 'rxjs';

@Injectable()
export abstract class RecipeCollectionService
  implements RecipeCollectionRepository
{
  constructor() {}

  collections$: Observable<RecipeCollection[]>;

  abstract getAll(): Observable<RecipeCollection[]>;

  abstract getById(id: string): Observable<RecipeCollection>;

  abstract add(collection: RecipeCollection): Observable<RecipeCollection>;

  abstract removeById(id: string): Observable<RecipeCollection>;

  abstract update(
    collection: RecipeCollection,
    id: string,
  ): Observable<RecipeCollection>;
}
