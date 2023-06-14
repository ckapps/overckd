import * as t from 'io-ts';
import { Tag } from '@overckd/domain';
import { slug } from '@overckd/core';
import { tag } from '../codec/tag/tag.codec';
import { overckdFileCodec } from './overckd-file';

const filetype = 'tags';
const tagsFileContent = overckdFileCodec(
  filetype,
  '1.0.0',
  t.type({
    tags: t.array(tag),
  }),
);

type TagsFileContent = t.TypeOf<typeof tagsFileContent>;

/**
 * Manual decoding for recipe collection files.
 *
 * @param i Decoded file content
 */
function decodeTagsFile(i: TagsFileContent) {
  const { tags } = i;

  return tags.map(
    t =>
      ({
        ...t,
        uri: slug(t.label),
      } as Tag),
  );
}

const dtoParser = new t.Type<Tag[], TagsFileContent, TagsFileContent>(
  `${filetype}-content`,
  (a): a is Tag[] => Array.isArray(a),
  (i, c) => {
    try {
      return t.success(decodeTagsFile(i));
    } catch (e) {
      return t.failure(i, c);
    }
  },
  // TODO: Implement
  a => {
    throw new Error('Not implemented');
  },
);

/**
 * Codec for encoding/decoding tags files
 */
export const tagsFile = tagsFileContent.pipe(dtoParser);
