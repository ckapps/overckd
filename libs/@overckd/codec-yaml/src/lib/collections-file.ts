import {
  Collection,
  CollectionId,
  CollectionIdFromString,
  RecipeId,
  RecipeRef,
} from '@overckd/domain';
import { Schema, SchemaGetter } from 'effect';
import { overckdFile } from './overckd-file';
import { fromYamlString } from './yaml';

const CollectionYaml = Schema.Struct({
  id: CollectionIdFromString,
  name: Schema.NonEmptyString,
  description: Schema.String,
});
type CollectionYaml = typeof CollectionYaml.Type;

const RecipeEntryYaml = Schema.Struct({
  name: Schema.NonEmptyString,
  uri: Schema.String,
  collections: Schema.Array(CollectionYaml),
});

const CollectionsFileContent = overckdFile({
  collections: Schema.Array(CollectionYaml),
  recipes: Schema.Record(Schema.String, RecipeEntryYaml),
});
type CollectionsFileContent = typeof CollectionsFileContent.Type;

/**
 * Joins the collections that the recipe entries list, in the order they first
 * appear. A recipe ref takes the entry's name as id, as the recipe codec does
 * for the recipe.
 */
const joinCollections = ({
  recipes,
}: CollectionsFileContent): ReadonlyArray<Collection> => {
  const joined = new Map<
    CollectionId,
    { readonly collection: CollectionYaml; readonly recipes: Array<RecipeRef> }
  >();

  for (const entry of Object.values(recipes)) {
    const ref = RecipeRef.make({
      id: RecipeId.make(entry.name),
      name: entry.name,
    });
    for (const collection of entry.collections) {
      const found = joined.get(collection.id);
      if (found === undefined) {
        joined.set(collection.id, { collection, recipes: [ref] });
      } else {
        found.recipes.push(ref);
      }
    }
  }

  return Array.from(joined.values(), ({ collection, recipes }) =>
    Collection.make({ ...collection, recipes }),
  );
};

/**
 * The collections file (`overckd.collections.yaml`): YAML text → the
 * collections.
 *
 * The file lists the collections and maps each recipe to the collections it
 * belongs to, usually through YAML anchors. As in the legacy codec, the
 * collections are joined from the recipes, so a collection without recipes is
 * left out. Decoding only, like `RecipeFileYaml`.
 */
export const CollectionsFileYaml = fromYamlString(CollectionsFileContent).pipe(
  Schema.decodeTo(Schema.toType(Schema.Array(Collection)), {
    decode: SchemaGetter.transform(joinCollections),
    encode: SchemaGetter.forbiddenEncoding,
  }),
);
