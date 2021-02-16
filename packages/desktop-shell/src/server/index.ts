import { BoundDependency, ContextDependency } from '@marblejs/core';
import log from 'electron-log';
import { from, Observable } from 'rxjs';

import { server, ServerConfig } from '@overckd/server';

import { getPath, PathId } from '../paths';
import { ServerLogScope } from './server-log-scope.enum';

const serverLog = log.scope(ServerLogScope.Server);

type Deps = BoundDependency<unknown, ContextDependency>[];

function prepareConfig(config: ServerConfig): ServerConfig {
  const { port: serverPort } = config;

  if (serverPort) {
    serverLog.info('Setting up server on port %d', serverPort);
  } else {
    serverLog.info('Setting up server on dynamic port');
  }

  // Set up serving images
  const imagePath = getPath(PathId.Images);
  serverLog.info('serving images from', imagePath);

  return {
    ...config,
    paths: {
      ...config.paths,
      images: imagePath,
    },
  };
}

async function startServer(deps: Deps, config: ServerConfig) {
  // Start server
  await (await server(deps, config))();

  return true;
}

/**
 * Initializes the server.
 *
 * @param config The server configuration
 */
export function initServer(
  deps: Deps,
  config: ServerConfig,
): Observable<boolean> {
  return from(startServer(deps, prepareConfig(config)));
}
