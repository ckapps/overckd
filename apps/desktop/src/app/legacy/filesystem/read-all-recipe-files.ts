import { readDir, readFile } from '@ckapp/rxjs-node-fs';
import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { RecipeFileYaml } from '@overckd/codec-yaml';
import { Compat } from '@overckd/domain-experimental';
import { Schema, Struct } from 'effect';
import * as path from 'path';
import { from, map, mergeMap, Observable, toArray } from 'rxjs';

/** A recipe as rxdb holds it: the legacy recipe JSON, without id. */
type RecipeDocument = Omit<
  Schema.Codec.Encoded<typeof Compat.RecipePreparationLegacyJson>,
  'id'
>;

const decodeRecipeFile = Schema.decodeSync(RecipeFileYaml);
const encodeLegacyJson = Schema.encodeSync(Compat.RecipePreparationLegacyJson);

const toRecipeDocument = (text: string): RecipeDocument =>
  Struct.omit(encodeLegacyJson(decodeRecipeFile(text)), ['id']);

/**
 * @param dir
 * Path to the directory
 *
 * @returns
 * Observable that emits with the parsed recipes in the
 * given `dir`.
 */
export function readAllRecipeFiles(dir: string): Observable<RecipeDocument[]> {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.recipe.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    map(toRecipeDocument),
    toArray(),
  );
}
