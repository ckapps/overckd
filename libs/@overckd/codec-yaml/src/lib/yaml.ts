import { Effect, Schema, SchemaIssue, SchemaTransformation } from 'effect';
import { Yaml } from 'effect/encoding';

/**
 * YAML text as plain data; invalid YAML is a schema issue like any other.
 *
 * Effect's `Yaml` only parses, so the encoding writes JSON on one line: JSON is
 * YAML too, and `Yaml.parse` reads it back. Files that people edit need a YAML
 * writer, which waits for the first command that writes one.
 */
const YamlString = Schema.String.pipe(
  Schema.decodeTo(
    Schema.Unknown,
    SchemaTransformation.transformEffect<unknown, string>({
      decode: (text, options) =>
        Effect.try({
          try: () => Yaml.parse(text),
          catch: () =>
            new SchemaIssue.InvalidValue(
              { message: 'Invalid YAML' },
              text,
              options,
            ),
        }),
      encode: value => Effect.succeed(JSON.stringify(value)),
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
