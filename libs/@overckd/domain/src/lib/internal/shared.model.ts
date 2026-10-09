import { Schema } from 'effect';

/**
 * A positive number.
 *
 * @category Models
 */
export const Positive = Schema.Number.check(Schema.isGreaterThan(0));

/**
 * A positive integer.
 *
 * @category Models
 */
export const PositiveInt = Schema.Int.check(Schema.isGreaterThan(0));

/**
 * A non-empty string as an option.
 *
 * @category Models
 */
export const OptionNonEmptyString = Schema.OptionFromOptionalNullOr(
  Schema.NonEmptyString,
);

/**
 * @category Brands
 */
export const HtmlStringTypeId = '@overckd/HtmlString';

/**
 * @category Models
 */
export type HtmlString = typeof HtmlString.Type;
export const HtmlString = Schema.String.pipe(
  Schema.brand(HtmlStringTypeId),
).annotate({
  identifier: 'HtmlString',
  title: 'htmlString',
  description: 'A HTML encoded string',
});

/**
 * @category Models
 */
export type NonEmptyHtmlString = typeof HtmlString.Type;
export const NonEmptyHtmlString = Schema.NonEmptyString.pipe(
  Schema.brand(HtmlStringTypeId),
).annotate({
  identifier: 'NonEmptyHtmlString',
  title: 'nonEmptyHtmlString',
  description: 'A HTML encoded string',
});
