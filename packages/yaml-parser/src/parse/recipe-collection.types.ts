export interface YamlRecipeCollection {
  id: string;
  name: string;
  description: string;
}

export interface YamlRecipe {
  id: string;
  name: string;
  uri: string;
  collections: YamlRecipeCollection[];
}

export interface YamlRecipeCollectionFile {
  overckd: string;
  collections: { [k: string]: YamlRecipeCollection };
  recipes: { [k: string]: YamlRecipe };
}
