import { fromFile } from './from-file';
import { parseYamlSafe } from './operators';
import { parseRecipeCollection } from './operators/parse-recipe-collection';

export function fromRecipeCollection(filename: string) {
  return fromFile(filename).pipe(
    parseYamlSafe({ filename }),
    parseRecipeCollection(),
  );
}
