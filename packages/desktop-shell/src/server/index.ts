import log from 'electron-log';

import { BoundDependency, ContextDependency } from '@marblejs/core';

import { server, ServerConfig } from '@overckd/server';

import { ServerLogScope } from './server-log-scope.enum';
import { getPath, PathId } from '../paths';

const serverLog = log.scope(ServerLogScope.Server);

type Deps = BoundDependency<unknown, ContextDependency>[];

/**
 * Initializes the server.
 *
 * @param config The server configuration
 */
export async function initServer(
  deps: Deps,
  config: ServerConfig,
): Promise<boolean> {
  const { port: serverPort } = config;

  if (serverPort) {
    serverLog.info('Setting up server on port %d', serverPort);
  } else {
    serverLog.info('Setting up server on dynamic port');
  }

  // Set up serving images
  const imagePath = getPath(PathId.Images);
  serverLog.info('serving images from', imagePath);
  config.paths.images = imagePath;

  // Start server
  await (await server(deps, config))();

  return true;
}
