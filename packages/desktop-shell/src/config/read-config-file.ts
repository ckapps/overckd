import * as path from 'path';

import { readFile } from '@overckd/yaml-parser/dist/fs';
import { parseYamlSafe } from '@overckd/yaml-parser/dist/yaml';

import { YamlConfig } from './app-config.types';

/**
 * Reads the yaml configuration file at path `file`.
 *
 * @param file The path to the configuration file
 */
export async function readConfigFile(file: string): Promise<YamlConfig> {
  const fileContent = await readFile(file, { encoding: 'utf-8' });

  const doc = parseYamlSafe<YamlConfig>(fileContent);

  // If the root is not set, we provide the enclosing folder of the file
  if (!doc.pathRoot) {
    doc.pathRoot = path.dirname(path.resolve(file));
  }

  return doc;
}
