import {
  Collection,
  CollectionId,
  RecipeId,
  RecipeRef,
} from '@overckd/domain-experimental';
import { Schema } from 'effect';
import { describe, expect, it } from 'vitest';
import { CollectionsFileYaml } from './collections-file';

// The file `data/example-1/app/overckd.collections.yaml`.

const collectionsYaml = `overckd: 1.0.0

collections:
  - &sweet
    id: sweet
    name: Sweets
    description: Something sweet

  - &salty
    id: salty
    name: Salty
    description: Something salty

recipes:
  #######################
  # All the sweet stuff #
  #######################
  recipe_1:
    name: Recipe 1
    uri: overckd://localhost
    collections:
      - *sweet
  recipe_2:
    name: Some other sweet sweet recipe
    uri: overckd://localhost
    collections:
      - *sweet

  #######################
  # All the salty stuff #
  #######################
  recipe_3:
    name: Some delicous salty recipe
    uri: overckd://localhost
    collections:
      - *salty
`;

const cakesYaml = `overckd: 1.0.0
collections:
  - &cakes
    id: cakes
    name: Cakes
    description: ''
  - id: empty
    name: Empty
    description: Nothing yet
recipes:
  cheesecake:
    name: Cheesecake
    uri: overckd://localhost
    collections:
      - *cakes
`;

const ref = (name: string) => RecipeRef.make({ id: RecipeId.make(name), name });

describe('CollectionsFileYaml', () => {
  const decode = Schema.decodeSync(CollectionsFileYaml);

  it('should join the collections of the file in data/ from its recipes', () => {
    expect(decode(collectionsYaml)).toEqual([
      Collection.make({
        id: CollectionId.make('sweet'),
        name: 'Sweets',
        description: 'Something sweet',
        recipes: [ref('Recipe 1'), ref('Some other sweet sweet recipe')],
      }),
      Collection.make({
        id: CollectionId.make('salty'),
        name: 'Salty',
        description: 'Something salty',
        recipes: [ref('Some delicous salty recipe')],
      }),
    ]);
  });

  it('should take the name of a recipe as the id of its ref, not its key', () => {
    const [cakes] = decode(cakesYaml);

    expect(cakes.recipes).toEqual([ref('Cheesecake')]);
  });

  it('should leave out collections without recipes', () => {
    expect(decode(cakesYaml).map(({ id }) => id)).toEqual(['cakes']);
  });

  it('should fail without the overckd header', () => {
    expect(() => decode(cakesYaml.replace('overckd: 1.0.0\n', ''))).toThrow();
  });

  it('should fail on another version of the format', () => {
    expect(() =>
      decode(cakesYaml.replace('overckd: 1.0.0', 'overckd: 2.0.0')),
    ).toThrow();
  });

  it('should fail on a recipe without name', () => {
    expect(() =>
      decode(cakesYaml.replace('    name: Cheesecake\n', '')),
    ).toThrow();
  });

  it('should fail on invalid YAML', () => {
    expect(() => decode(`${cakesYaml}  - [`)).toThrow('Invalid YAML');
  });

  it('should not encode yet', () => {
    const collections = decode(cakesYaml);

    expect(() => Schema.encodeSync(CollectionsFileYaml)(collections)).toThrow(
      'Encoding is not supported',
    );
  });
});
