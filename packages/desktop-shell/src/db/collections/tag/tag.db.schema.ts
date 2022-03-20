import { Tag } from '@overckd/domain';
import { RxJsonSchema } from 'rxdb';

export const schema: RxJsonSchema<Tag> = {
  version: 0,
  type: 'object',
  properties: {
    uri: {
      type: 'string',
      primary: true,
    },
    label: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
    icon: {
      type: 'string',
    },
  },
};
