import * as Schema from 'effect/Schema';
import * as Timer from './timer';

export class PreparationStep extends Schema.Class<PreparationStep>(
  '@overckd/PreparationStep',
)({
  text: Schema.NonEmptyString,
  /** Text format. */
  format: Schema.Literal('text', 'html'),
  timers: Schema.optional(
    Schema.Struct({
      start: Schema.Array(Timer.TimerId),
      await: Schema.Array(Timer.TimerId),
    }),
  ),
}) {}

export const Equivalence = Schema.equivalence(PreparationStep);

// Convert "on"/"off" to boolean and back
export const PreparationStepFromString = Schema.transform(
  // Source schema: "on" or "off"
  Schema.NonEmptyString,
  // Target schema: boolean
  PreparationStep,
  {
    strict: true,
    decode: text => ({ text, format: 'text' as const }),
    encode: step => step.text,
  },
);
