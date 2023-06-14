import * as t from 'io-ts';

/**
 * Creates a new versioned file codec
 *
 * @param version The version of the codec
 * @param codec The codec
 */
export function overckdFileCodec<
  T extends t.Mixed,
  O = t.TypeOf<T>,
  I = unknown,
>(filetype: string, version: string, codec: T): t.Type<t.TypeOf<T>, O, I> {
  const versionedFileCodec = t.intersection([
    t.type({
      overckd: t.literal(version),
    }),
    codec,
  ]);

  return new t.Type<t.TypeOf<T>, O, I>(
    `${filetype}-codec-v${version}`,
    codec.is,
    (s, c) => versionedFileCodec.validate(s, c),
    obj => ({
      ...obj,
      overckd: version,
    }),
  );
}
