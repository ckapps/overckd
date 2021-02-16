import { protocol } from 'electron';
import * as log from 'electron-log';

import { RecipeCollection } from '@overckd/domain';

const logger = log.scope('protocol');
const SCHEMA = 'overckd';

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: SCHEMA,
//     privileges: {
//       // bypassCSP: true,
//       supportFetchAPI: true,
//     },
//   },
// ]);

function overcookedProtocol() {
  return protocol.registerStringProtocol(SCHEMA, (req, cb) => {
    logger.info('got request', req.url, req.method);

    const data: RecipeCollection[] = [
      { name: 'collection 1', id: '1', description: '', recipes: [] },
    ];

    cb({
      statusCode: 200,
      mimeType: 'application/json',
      data: JSON.stringify(data),
    });
  });
}

const protocols = new Map<string, () => boolean>();
protocols.set(SCHEMA, overcookedProtocol);

export function initProtocols(): boolean {
  logger.silly('called: initProtocols()');

  return Array.from(protocols.entries()).every(([key, registerFn]) => {
    logger.silly('registring protocol', key);
    if (!registerFn()) {
      logger.error('could not register protocol:', key);
      return false;
    }

    logger.debug('registered protocol', key);
    return true;
  });
}
