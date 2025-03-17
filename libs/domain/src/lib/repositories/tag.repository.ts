import { Observable } from 'rxjs';

import { Tag } from '../models/tag/tag.model';

export interface TagRepository {
  /**
   * @param uri URI identifier
   *
   * @returns
   * An observable that emits with the tag with the
   * requested `uri`.
   */
  getByUri(uri: Tag['uri']): Observable<Tag | undefined>;
}
