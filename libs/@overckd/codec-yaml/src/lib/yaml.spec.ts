import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { fromYamlString } from './yaml';

const Shopping = fromYamlString(
  Schema.Struct({ name: Schema.String, items: Schema.Array(Schema.String) }),
);

describe('fromYamlString', () => {
  const decode = Schema.decodeUnknownSync(Shopping);
  const encode = Schema.encodeSync(Shopping);

  it('should decode YAML text with the schema', () => {
    expect(decode('name: Market\nitems:\n  - Flour\n  - Sugar\n')).toEqual({
      name: 'Market',
      items: ['Flour', 'Sugar'],
    });
  });

  it('should resolve YAML anchors', () => {
    expect(decode('name: &name Flour\nitems: [*name]')).toEqual({
      name: 'Flour',
      items: ['Flour'],
    });
  });

  it('should encode to YAML text that decodes to the same value', () => {
    const shopping = { name: 'Market', items: ['Flour', 'Sugar'] };

    expect(decode(encode(shopping))).toEqual(shopping);
  });

  it('should fail on invalid YAML', () => {
    expect(() => decode('items: [Flour')).toThrow('Invalid YAML');
  });

  it('should fail on YAML of the wrong shape', () => {
    expect(() => decode('name: Market\nitems: Flour')).toThrow();
  });
});
