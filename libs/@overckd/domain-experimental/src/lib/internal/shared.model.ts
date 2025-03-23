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
