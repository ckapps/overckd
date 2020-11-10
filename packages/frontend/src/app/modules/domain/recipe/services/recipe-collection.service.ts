import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RecipeCollection } from '@overckd/domain';

@Injectable()
export abstract class RecipeCollectionService {
  constructor() {}

  abstract list(): Observable<RecipeCollection[]>;
}
