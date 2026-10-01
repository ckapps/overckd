import { Schema } from 'effect';

/** The content of an overckd file: the version header and `fields`. */
export const overckdFile = <Fields extends Schema.Struct.Fields>(
  fields: Fields,
) => Schema.Struct({ overckd: Schema.Literal('1.0.0'), ...fields });
