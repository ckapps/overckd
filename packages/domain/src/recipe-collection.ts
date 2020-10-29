export interface CollectionRecipe {
  id: string;
  name: string;
}

export interface RecipeCollection {
  id: string;
  name: string;
  description: string;
  recipes: CollectionRecipe[];
}
