import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Recipe } from '@overckd/domain';

@Injectable()
export abstract class RecipeService {
  constructor() {}

  abstract get(id): Observable<Recipe>;
}
