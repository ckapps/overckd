/* eslint-disable @typescript-eslint/ban-types */

import * as yaml from 'js-yaml';

/**
 * Parses YAML from content
 *
 * @param opts
 */
export function dumpYamlSafe(obj: object, opts?: yaml.DumpOptions): string {
  return yaml.safeDump(obj, opts);
}
