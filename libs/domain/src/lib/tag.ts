import * as Schema from 'effect/Schema';
import * as Uri from './uri';

export class Tag extends Schema.Class<Tag>('@overckd/tag')({
  uri: Uri.Uri,
  label: Schema.NonEmptyString,
}) {}

export const Equivalence = Schema.equivalence(Tag);

export const fromLabel = (label: string): Tag =>
  Tag.make({
    uri: Uri.fromString(label),
    label,
  });
