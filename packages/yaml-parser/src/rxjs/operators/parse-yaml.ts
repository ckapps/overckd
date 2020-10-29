/* eslint-disable @typescript-eslint/ban-types */

import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import * as yaml from 'js-yaml';

export function parseYamlSafe<T>(
  opts?: yaml.LoadOptions,
): OperatorFunction<string, T>;

export function parseYamlSafe(
  opts?: yaml.LoadOptions,
): OperatorFunction<string, string | object | undefined>;

/**
 * Parses YAML from content
 *
 * @param opts
 */
export function parseYamlSafe(
  opts?: yaml.LoadOptions,
): OperatorFunction<string, string | object | undefined> {
  return map(fileContent => yaml.safeLoad(fileContent, opts));
}
