import * as t from 'io-ts';

export type LabeledC<T extends t.Mixed> = t.IntersectionC<
  [
    T,
    t.TypeC<{
      label: t.StringC;
    }>,
  ]
>;

/**
 * Generic codec for an object with a `label` property.
 *
 * @param codec The generic
 */
export function labeled<T extends t.Mixed>(codec: T): LabeledC<T> {
  return t.intersection([codec, t.type({ label: t.string })]);
}
