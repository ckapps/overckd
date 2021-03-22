import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Tag, TagQuery } from '@overckd/domain';
import { Page } from '@overckd/domain/dist/search';

@Injectable()
export abstract class TagService {
  abstract findByQuery(query: TagQuery): Observable<Page<Tag>>;
}
