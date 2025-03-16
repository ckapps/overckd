import * as Schema from 'effect/Schema';

/**
 * @category Symbols
 */
export const TagIdTypeId: unique symbol = Symbol.for('@overckd/TagId');

/**
 * @category Models
 */
export type TagId = typeof TagId.Type;
export const TagId = Schema.NonEmptyString.pipe(
  Schema.brand(TagIdTypeId),
).annotations({ identifier: 'TagId' });

/**
 * @category Models
 */
export class Tag extends Schema.Class<Tag>('@overckd/Tag')({
  /** tag URI. */
  uri: TagId,
  /** the tag label. */
  label: Schema.NonEmptyString,
  /** Tag icon. */
  icon: Schema.OptionFromSelf(Schema.String),
}) {}

/**
 * @category Errors
 */
export class TagNotFound extends Schema.TaggedError<TagNotFound>()(
  'TagNotFound',
  { id: TagId },
) {}

/**
 * @category Models
 */

/**
 * @category instances
 */
export const Equivalence = Schema.equivalence(Tag);

/**
 * @category Schemas
 */
export const TagIdFromString = Schema.String.pipe(Schema.compose(TagId));

/**
 * @category Schemas
 */
export const TagFromObject = Schema.Struct({
  uri: TagIdFromString,
  label: Schema.NonEmptyString,
  icon: Schema.optionalWith(Schema.NonEmptyString, {
    nullable: true,
    as: 'Option',
  }),
}).pipe(Schema.compose(Tag));
