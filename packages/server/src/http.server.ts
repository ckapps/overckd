import {
  createServer,
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
  createReader,
} from '@marblejs/core';
import {
  EventBusToken,
  EventBusClientToken,
  eventBusClient,
  eventBus,
} from '@marblejs/messaging';

import { defaultServerConfig, ServerConfig } from './config';
import { listener } from './http.listener';
import { eventBusListener } from './eventbus.listener';
import { ServerConfigToken } from './tokens';

/**
 * Creates the server from the given `config`.
 *
 * @param deps Dependencies for the server
 * @param config Server configuration
 */
export function server(
  deps: BoundDependency<any, ContextDependency>[],
  config: ServerConfig = defaultServerConfig,
) {
  const { port } = config;

  // Add server config to the dependencies
  const ServerConfigReader = createReader<ServerConfig>(() => config);

  return createServer({
    listener,
    port,
    dependencies: [
      bindEagerlyTo(EventBusClientToken)(eventBusClient),
      bindEagerlyTo(EventBusToken)(eventBus({ listener: eventBusListener })),
      bindEagerlyTo(ServerConfigToken)(ServerConfigReader),
      ...deps,
    ],
  });
}
