import { readFile } from '@ckapp/rxjs-node-fs';
import { yamlDecode } from '@overckd/yaml-parser';
import { appConfigFile } from '@overckd/yaml-parser/dist/modules/desktop-shell';
import * as path from 'path';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
