import * as path from 'path';
import { Context, createReader, useContext } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';

import { Recipe } from '@overckd/domain';
import { RecipeRepository } from '@overckd/domain/dist/repositories';
import {
  parseYamlSafe,
  YamlRecipeFile,
  parseRecipeFile,
  toYamlFile,
  dumpYamlSafe,
} from '@overckd/yaml-parser';
import { readFile, readDir, writeFile } from '@overckd/yaml-parser/dist/fs';

import { AppConfigToken } from '../config/config.token';
import { getPath, PathId } from '../paths';

let recipesFolder: string;

async function getAllRecipeFilesInFolder(dir: string) {
  const files = await readDir(dir);
  const recipeFiles = files
    .filter(f => f.endsWith('.recipe.yaml'))
    .map(f => path.resolve(dir, f));
  return recipeFiles;
}

async function readRecipeFile(filepath: string) {
  const fileContent = await readFile(filepath, { encoding: 'utf-8' });
  const doc = parseYamlSafe<YamlRecipeFile>(fileContent);
  return parseRecipeFile(doc);
}

async function saveRecipe(dir: string, id: string, recipe: Recipe) {
  const filename = path.resolve(dir, `${id}.recipe.yaml`);
  console.log('saving recipe', id);
  console.log('in', filename);

  const yamlRecipe = toYamlFile(recipe);
  const fileContent = dumpYamlSafe(yamlRecipe);

  return writeFile(filename, fileContent, { encoding: 'utf-8' });
}

async function readAllRecipeFiles(dir: string) {
  const files = await getAllRecipeFilesInFolder(dir);

  return Promise.all(files.map(readRecipeFile));
}

class FileRepo implements RecipeRepository {
  async getAll(): Promise<Recipe[]> {
    throw new Error('Method not implemented.');
  }

  async add(recipe: Recipe): Promise<Recipe> {
    // Generate some id for saving the recipe
    const generatedId = recipe.name;

    // Now save the recipe
    await saveRecipe(recipesFolder, generatedId, recipe);

    // And return it
    return recipe;
  }

  async removeByName(name: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async getByName(name: string): Promise<Recipe> {
    const recipesFromFiles = await readAllRecipeFiles(recipesFolder);
    const recipe = recipesFromFiles.find(r => r.name === name);

    return recipe || null;
  }

  async update(recipe: Recipe, name: string): Promise<Recipe> {
    throw new Error('Method not implemented.');
  }
}

export const RecipeFileRespository: Reader<
  Context,
  RecipeRepository
> = createReader<RecipeRepository>(ask => {
  const { paths } = useContext(AppConfigToken)(ask);

  recipesFolder = getPath(PathId.Recipes);

  return new FileRepo();
});
