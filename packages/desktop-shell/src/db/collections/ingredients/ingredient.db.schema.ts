import { Ingredient } from '@overckd/domain';
import { RxJsonSchema } from 'rxdb';

export const schema: RxJsonSchema<Ingredient> = {
  version: 0,
  type: 'object',
  properties: {
    uri: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    tags: {
      type: 'array',
    },
  },
};
