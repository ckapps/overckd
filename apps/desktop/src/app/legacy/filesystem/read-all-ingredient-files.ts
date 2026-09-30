import { readDir, readFile } from '@ckapp/rxjs-node-fs';
import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { Ingredient } from '@overckd/domain';
import { ingredientsFile, yamlDecode } from '@overckd/yaml';
import * as path from 'path';
import {
  from,
  map,
  mergeMap,
  Observable,
  OperatorFunction,
  reduce,
} from 'rxjs';

function reduceIngredients(): OperatorFunction<Ingredient[], Ingredient[]> {
  return reduce((acc, cur) => [...acc, ...cur], [] as Ingredient[]);
}

/**
 * @param dir
 * Path to the directory
 *
 * @returns
 */
export function readAllIngredientFiles(dir: string): Observable<Ingredient[]> {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.ingredients.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    yamlDecode(ingredientsFile),
    reduceIngredients(),
  );
}
