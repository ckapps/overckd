import * as Schema from 'effect/Schema';

/**
 * A positive integer.
 *
 * @category Models
 */
export const PositiveInt = Schema.asSchema(
  Schema.extend(Schema.Positive, Schema.Int),
);

/**
 * A non-empty string as an option.
 *
 * @category Models
 */
export const OptionNonEmptyString = Schema.optionalWith(Schema.NonEmptyString, {
  nullable: true,
  as: 'Option',
});

/**
 * @category Symbols
 */
export const HtmlStringTypeId: unique symbol = Symbol.for(
  '@overckd/HtmlString',
);

/**
 * @category Models
 */
export type HtmlString = typeof HtmlString.Type;
export const HtmlString = Schema.String.pipe(
  Schema.brand(HtmlStringTypeId),
).annotations({ identifier: 'HtmlString' });

/**
 * @category Models
 */
export type NonEmptyHtmlString = typeof HtmlString.Type;
export const NonEmptyHtmlString = Schema.NonEmptyString.pipe(
  Schema.brand(HtmlStringTypeId),
).annotations({ identifier: 'HtmlString' });
