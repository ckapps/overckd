/* eslint-disable @typescript-eslint/ban-types */

import * as yaml from 'js-yaml';

export function parseYamlSafe<T>(
  fileContent: string,
  opts?: yaml.LoadOptions,
): T;

export function parseYamlSafe(
  fileContent: string,
  opts?: yaml.LoadOptions,
): string | object | undefined;

/**
 * Parses YAML from content
 *
 * @param opts
 */
export function parseYamlSafe(
  fileContent: string,
  opts?: yaml.LoadOptions,
): string | object | undefined {
  return yaml.safeLoad(fileContent, opts);
}
