import { Ingredient } from '@overckd/domain';
import { RxJsonSchema } from 'rxdb';

export const schema: RxJsonSchema<Ingredient> = {
  version: 0,
  type: 'object',
  primaryKey: 'uri',
  properties: {
    uri: {
      type: 'string',
      maxLength: 265,
    },
    name: {
      type: 'string',
    },
    tags: {
      type: 'array',
    },
  },
};
