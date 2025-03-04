import { Injectable } from '@angular/core';
import { Page, Tag, TagQuery } from '@overckd/domain';
import { Observable } from 'rxjs';

@Injectable()
export abstract class TagService {
  abstract add(tag: Tag): Observable<Tag | undefined>;
  abstract findByQuery(query: TagQuery): Observable<Page<Tag>>;
}
