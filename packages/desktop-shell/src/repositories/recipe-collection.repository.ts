import * as path from 'path';
import { Context, createReader, useContext } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';

import { RecipeCollection } from '@overckd/domain';
import { RecipeCollectionRepository } from '@overckd/domain/dist/repositories/recipe-collection.repository';
import { fromRecipeCollection } from '@overckd/yaml-parser';

import { AppConfigToken } from '../config/config.token';

let filename: string;

class FileRepo implements RecipeCollectionRepository {
  getAll(): Promise<RecipeCollection[]> {
    return fromRecipeCollection(filename).toPromise();
  }
  add(collection: RecipeCollection): Promise<RecipeCollection> {
    throw new Error('Method not implemented.');
  }
  removeById(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<RecipeCollection> {
    throw new Error('Method not implemented.');
  }
  update(collection: RecipeCollection, id: string): Promise<RecipeCollection> {
    throw new Error('Method not implemented.');
  }
}

export const RecipeCollectionFileRespository: Reader<
  Context,
  RecipeCollectionRepository
> = createReader<RecipeCollectionRepository>(ask => {
  const { paths } = useContext(AppConfigToken)(ask);

  filename = path.join(paths.app, 'overckd.collections.yaml');
  return new FileRepo();
});
