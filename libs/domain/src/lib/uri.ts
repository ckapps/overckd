import * as Fn from 'effect/Function';
import * as Schema from 'effect/Schema';
import * as Str from 'effect/String';

export const UriTypeId: unique symbol = Symbol.for('@overckd/Uri');

export type Uri = typeof Uri.Type;
export const Uri = Schema.String.pipe(
  Schema.pattern(/^[^\s]+$/, {
    message: Fn.constant('URI cannot contain spaces'),
  }),
  Schema.brand(UriTypeId),
).annotations({ identifier: 'Uri' });

export const fromString = (input: string): Uri =>
  Fn.pipe(input, _slugify, Uri.make);

const _slugify = (input: string): string =>
  Fn.pipe(
    input,
    Str.trim,
    Str.toLowerCase,
    // Matches all single or repeated ' ' and replaces them with '-'
    Str.replace(/\s+/g, '-'),
  );
