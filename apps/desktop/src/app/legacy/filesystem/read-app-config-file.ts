import { readFile } from '@ckapp/rxjs-node-fs';
import { appConfigFile, yamlDecode } from '@overckd/yaml';
import * as path from 'path';
import { map, Observable } from 'rxjs';
import { AppConfigFile, DecodedAppConfigFile } from '../config';

/**
 * @param pathToConfigFile
 * Path to the configuration file
 *
 * @returns
 * Observable that emits with the data
 * read and decoded from `pathToConfigFile`.
 */
export function readAppConfigFile(
  pathToConfigFile: string,
): Observable<DecodedAppConfigFile> {
  return readFile(pathToConfigFile, { encoding: 'utf8' }).pipe(
    yamlDecode(appConfigFile),
    map((yaml: AppConfigFile) => ({
      ...yaml,
      // If the root is not set, we provide the enclosing folder of the file
      pathRoot: yaml.pathRoot || path.dirname(path.resolve(pathToConfigFile)),
    })),
  );
}
