import { RecipeCollection } from '@overckd/domain';
import { RxJsonSchema } from 'rxdb';

export const schema: RxJsonSchema<RecipeCollection> = {
  version: 0,
  type: 'object',
  properties: {
    // TODO: Make URI
    // uri: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    recipes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          // TODO: Make URI
          // uri: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
      },
    },
  },
};
