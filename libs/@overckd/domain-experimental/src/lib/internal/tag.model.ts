import * as HttpApiSchema from '@effect/platform/HttpApiSchema';
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
export class Tag extends Schema.Class<Tag>('@overckd/Tag')(
  {
    /** tag URI. */
    uri: TagId,
    /** the tag label. */
    label: Schema.NonEmptyString,
    /** Tag icon. */
    icon: Schema.OptionFromSelf(Schema.String),
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
  HttpApiSchema.annotations({ status: 404 }),
) {}

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
export const TagFromJson = Schema.Struct({
  uri: TagIdFromString,
  label: Schema.NonEmptyString,
  icon: Schema.optionalWith(Schema.NonEmptyString, {
    nullable: true,
    as: 'Option',
  }),
}).pipe(Schema.compose(Tag));
