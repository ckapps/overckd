import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { Observable, of } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';

import { BaseTag, Tag, TagQuery } from '@overckd/domain';
import { TagRepository } from '@overckd/domain/dist/repositories';
import { filterTagsByQuery } from '@overckd/domain/dist/rxjs/tag';
import { asPagedResult } from '@overckd/domain/dist/rxjs/search';
import { Page } from '@overckd/domain/dist/search';

import { UriFactory } from './utils';
import { InMemoryRepo } from './in-memory-repo';

const uri = UriFactory(['tags']);

function makeTag(label: string, color?: string, icon?: string): Tag {
  return {
    label,
    color,
    icon,
    uri: uri(label),
  };
}

class TagRepo extends InMemoryRepo<Tag> implements TagRepository {
  add(tag: BaseTag): Observable<Tag> {
    return this._add(tag);
  }
  removeByUri(uri: string): Observable<Tag> {
    return this._remove({ uri });
  }
  getByUri(uri: string): Observable<Tag | undefined> {
    return this.findItem({ uri });
  }
  update(uri: string, tag: Tag): Observable<Tag | undefined> {
    return this._update(tag);
  }
  findByQuery(query: TagQuery): Observable<Page<Tag>> {
    const query$ = of(query);
    const items$ = this.all.pipe(take(1), switchExpandItems());

    return items$.pipe(
      withLatestFrom(query$),
      filterTagsByQuery(),
      asPagedResult(),
    );
  }

  equals(a: Tag, b: Tag): boolean {
    return a.uri === b.uri;
  }
}

export const MockTagRespository: Reader<
  Context,
  TagRepository
> = createReader<TagRepository>(() => {
  const initialValue = [
    makeTag('vegan', '#117935', 'leaf'),
    makeTag('vegetables', '#117935', 'leaf'),
    makeTag('fruit', '#117935', 'apple-alt'),
    makeTag('root vegetable', '#794c11', 'carrot'),
  ];
  const repo = new TagRepo(initialValue);

  return {
    add: (...args) => repo.add(...args),
    getByUri: (...args) => repo.getByUri(...args),
    findByQuery: (...args) => repo.findByQuery(...args),
    removeByUri: (...args) => repo.removeByUri(...args),
    update: (...args) => repo.update(...args),
  };
});
