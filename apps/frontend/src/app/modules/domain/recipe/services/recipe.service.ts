import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Recipe } from '@overckd/domain';

@Injectable()
export abstract class RecipeService {
  abstract get(id: Recipe['name']): Observable<Recipe>;
}
