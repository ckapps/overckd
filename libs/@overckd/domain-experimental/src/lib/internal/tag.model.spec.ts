import * as O from 'effect/Option';
import * as Schema from 'effect/Schema';
import { describe, expect, it } from 'vitest';
import { Tag, TagFromObject, TagId } from './tag.model';

describe('Tag', () => {
  it('should make a new tag', () => {
    const tag = Tag.make({
      uri: TagId.make('my-tag'),
      label: 'name',
      icon: O.none(),
    });

    expect(tag).toBeDefined();
  });

  describe('TagFromObject', () => {
    const decode = Schema.decodeSync(TagFromObject);

    it('should make a new tag from an object', () => {
      const tag = decode({
        uri: TagId.make('my-tag'),
        label: 'name',
        icon: 'some-icon',
      });

      expect(tag).toEqual({
        uri: TagId.make('my-tag'),
        label: 'name',
        icon: O.some('some-icon'),
      });
    });

    it('with missing icon', () => {
      const tag1 = decode({
        uri: TagId.make('my-tag'),
        label: 'name',
      });
      expect(tag1.icon).toEqual(O.none());

      const tag2 = decode({
        uri: TagId.make('my-tag'),
        label: 'name',
        icon: null,
      });
      expect(tag2.icon).toEqual(O.none());
    });
  });
});
