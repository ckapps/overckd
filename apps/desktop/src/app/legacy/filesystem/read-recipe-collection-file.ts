import { readFile } from '@ckapp/rxjs-node-fs';
import { CollectionsFileYaml } from '@overckd/codec-yaml';
import { CollectionJson } from '@overckd/domain-experimental';
import { Schema } from 'effect';
import { map, Observable } from 'rxjs';

/** A collection as rxdb holds it. */
type CollectionDocument = Schema.Codec.Encoded<typeof CollectionJson>;

const decodeCollectionsFile = Schema.decodeSync(CollectionsFileYaml);
const encodeCollectionJson = Schema.encodeSync(CollectionJson);

/**
 * @param filename
 * Path to the file
 *
 * @returns
 * Observable that emits with the parsed
 * recipe collections.
 */
export function readRecipeCollectionFile(
  filename: string,
): Observable<CollectionDocument[]> {
  return readFile(filename, { encoding: 'utf8' }).pipe(
    map(text =>
      decodeCollectionsFile(text).map(collection =>
        encodeCollectionJson(collection),
      ),
    ),
  );
}
