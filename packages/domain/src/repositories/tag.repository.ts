import { Observable } from 'rxjs';

import { Tag, TagQuery } from '../models/tag/tag.model';
import { Page } from '../search';

export interface TagRepository {
  findByQuery(query: TagQuery): Observable<Page<Tag>>;
}
