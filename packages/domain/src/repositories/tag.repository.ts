import { Observable } from 'rxjs';

import { Tag, TagQuery } from '../models/tag/tag.model';
import { Page } from '../search';

export interface TagRepository {
  /**
   * Adds a new tag
   *
   * @param tag New tag that should be added
   */
  add(tag: Tag): Observable<Tag>;

  /**
   * @param query Some query
   *
   * @returns
   * An observable that emits with an paged result of
   * tags that fullfill the query
   */
  findByQuery(query: TagQuery): Observable<Page<Tag>>;

  /**
   * @param uri URI identifier
   *
   * @returns
   * An observable that emits with the tag with the
   * requested `uri`.
   */
  getByUri(uri: Tag['uri']): Observable<Tag | undefined>;

  /**
   * Removes the tag with the given `uri`.
   *
   * @param uri URI identifier
   */
  removeByUri(uri: Tag['uri']): Observable<boolean>;

  /**
   * Updates the tag identified by `uri` with the given `tag`
   *
   * @param uri
   * @param tag
   */
  update(uri: Tag['uri'], tag: Tag): Observable<Tag | undefined>;
}
