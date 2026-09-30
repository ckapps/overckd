import { Schema } from 'effect';

/**
 * @category Brands
 */
export const TagIdTypeId = '@overckd/TagId';

/**
 * @category Models
 */
export type TagId = typeof TagId.Type;
export const TagId = Schema.NonEmptyString.pipe(
  Schema.brand(TagIdTypeId),
).annotate({ identifier: 'TagId' });

/**
 * @category Models
 */
export class Tag extends Schema.Class<Tag>('@overckd/Tag')(
  {
    /** tag URI. */
    uri: TagId,
    /** the tag label. */
    label: Schema.NonEmptyString,
    /** Tag icon. */
    icon: Schema.Option(Schema.String),
  },
  {
    identifier: 'Tag',
    title: 'Tag',
    description: 'A tag to apply to entities',
  },
) {}

/**
 * @category Errors
 */
export class TagNotFound extends Schema.TaggedError<TagNotFound>()(
  'TagNotFound',
  { id: TagId },
  { httpApiStatus: 404 },
) {}

/**
 * @category instances
 */
export const Equivalence = Schema.toEquivalence(Tag);

/**
 * @category Schemas
 */
export const TagIdFromString = Schema.String.pipe(Schema.decodeTo(TagId));

/**
 * @category Schemas
 */
export const TagFromJson = Schema.Struct({
  uri: TagIdFromString,
  label: Schema.NonEmptyString,
  icon: Schema.OptionFromOptionalNullOr(Schema.NonEmptyString),
}).pipe(Schema.decodeTo(Tag));
