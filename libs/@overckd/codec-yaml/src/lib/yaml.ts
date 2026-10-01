import { Effect, Schema, SchemaIssue, SchemaTransformation } from 'effect';
import { safeDump, safeLoad } from 'js-yaml';

/** YAML text as plain data; invalid YAML is a schema issue like any other. */
const YamlString = Schema.String.pipe(
  Schema.decodeTo(
    Schema.Unknown,
    SchemaTransformation.transformEffect<unknown, string>({
      decode: (text, options) =>
        Effect.try({
          try: () => safeLoad(text),
          catch: () =>
            new SchemaIssue.InvalidValue(
              { message: 'Invalid YAML' },
              text,
              options,
            ),
        }),
      encode: value => Effect.succeed(safeDump(value)),
    }),
  ),
);

/** A codec from YAML text to `schema`, which validates what the YAML contains. */
export const fromYamlString = <S extends Schema.Top>(schema: S) =>
  YamlString.pipe(
    Schema.decodeTo(
      schema,
      SchemaTransformation.passthrough({ strict: false }),
    ),
  );
