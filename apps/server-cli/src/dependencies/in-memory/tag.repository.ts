import { Context, createReader } from '@marblejs/core';
import { Tag, TagRepository } from '@overckd/domain';
import { Reader } from 'fp-ts/lib/Reader';
import { Observable } from 'rxjs';
import { InMemoryRepo } from './in-memory-repo';
import { UriFactory } from './utils';

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
  getByUri(uri: string): Observable<Tag | undefined> {
    return this.findItem({ uri });
  }

  equals(a: Tag, b: Tag): boolean {
    return a.uri === b.uri;
  }
}

export const MockTagRespository: Reader<Context, TagRepository> =
  createReader<TagRepository>(() => {
    const initialValue = [
      makeTag('vegan', '#117935', 'leaf'),
      makeTag('vegetables', '#117935', 'leaf'),
      makeTag('fruit', '#117935', 'apple-alt'),
      makeTag('root vegetable', '#794c11', 'carrot'),
    ];
    const repo = new TagRepo(initialValue);

    return {
      getByUri: (...args) => repo.getByUri(...args),
    };
  });
