import { Tag } from '@overckd/domain';
import { RxJsonSchema } from 'rxdb';

export const schema: RxJsonSchema<Tag> = {
  version: 0,
  type: 'object',
  primaryKey: 'uri',
  properties: {
    uri: {
      type: 'string',
      maxLength: 265,
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
