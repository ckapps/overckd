import * as Schema from 'effect/Schema';

export const TimerIdTypeId: unique symbol = Symbol.for('@overckd/TimerId');
export type TimerId = typeof TimerId.Type;
export const TimerId = Schema.NonEmptyString.pipe(
  Schema.brand(TimerIdTypeId),
).annotations({ identifier: 'TimerId' });

export enum TimeUnit {
  Seconds = 's',
  Minutes = 'm',
  Hours = 'h',
}

export class Timer extends Schema.Class<Timer>('@overckd/Timer')({
  /** Duration for the timer in `ms`. */
  duration: Schema.Number,
  /** Preferred unit for displaying. */
  units: Schema.optional(Schema.Enums(TimeUnit)),
}) {}

export const Equivalence = Schema.equivalence(Timer);
