import { RxJsonSchema } from 'rxdb';

export const schema: RxJsonSchema = {
  version: 0,
  type: 'object',
  properties: {
    name: {
      type: 'string',
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
