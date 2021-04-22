import { BoundDependency, ContextDependency, ServerIO } from '@marblejs/core';
import {
  LogLevel,
  logEnterExit,
} from '@ckapp/rxjs-snafu/lib/cjs/log/operators';
import { server, ServerConfig } from '@overckd/server';
import { from, Observable } from 'rxjs';
import { concatMap, mapTo, switchMap } from 'rxjs/operators';

import { getPath, PathId } from '../paths';
import { scoped, ServerLogScope } from '../logging';

const serverLog = scoped(ServerLogScope.Server);

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

function createServer(deps: Deps, config: ServerConfig) {
  return from(server(deps, config));
}

function startServer<T>(serverIO: ServerIO<T>) {
  return from(serverIO());
}

/**
 * Initializes the server.
 *
 * @param config The server configuration
 */
export function initServer(
  config: ServerConfig,
  deps: Observable<Deps>,
): Observable<boolean> {
  const serverConfig = prepareConfig(config);

  // Setting up the dependencies for marble.js
  const deps$ = deps.pipe(
    logEnterExit('Configuring dependencies', {
      logger: serverLog,
      level: LogLevel.Verbose,
    }),
  );

  return deps$.pipe(
    // Create the server
    concatMap(deps => createServer(deps, serverConfig)),
    // Start the server
    switchMap(serverIO => startServer(serverIO)),
    // Map the result
    mapTo(true),
  );
}
