import * as Fn from 'effect/Function';
import * as Schema from 'effect/Schema';
import * as Str from 'effect/String';

export const SlugTypeId: unique symbol = Symbol.for('@overckd/Slug');

export type Slug = typeof Slug.Type;
export const Slug = Schema.String.pipe(
  Schema.pattern(/^[^\s]+$/, {
    message: Fn.constant('Slug cannot contain spaces'),
  }),
  Schema.brand(SlugTypeId),
).annotations({ identifier: 'Slug' });

export const fromString = (input: string): Slug =>
  Fn.pipe(input, _slugify, Slug.make);

const _slugify = (input: string): string =>
  Fn.pipe(
    input,
    Str.trim,
    Str.toLowerCase,
    // Matches all single or repeated ' ' and replaces them with '-'
    Str.replace(/\s+/g, '-'),
  );
