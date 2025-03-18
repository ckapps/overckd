import { Recipe } from '@overckd/domain';
import { RxJsonSchema } from 'rxdb';

export const schema: RxJsonSchema<Recipe> = {
  version: 0,
  type: 'object',
  primaryKey: 'name',
  properties: {
    name: {
      type: 'string',
      maxLength: 265,
    },
    stepsEnumerated: {
      type: 'boolean',
    },
    portion: {
      type: 'object',
    },
    basedOn: {
      type: 'array',
    },
    ingredients: {
      type: 'array',
    },
    steps: {
      type: 'array',
    },
    groups: {
      type: 'array',
    },
    tips: {
      type: 'array',
    },
    timers: {
      type: 'object',
    },
    images: {
      type: 'array',
    },
    styles: {
      type: 'object',
    },
  },
};
