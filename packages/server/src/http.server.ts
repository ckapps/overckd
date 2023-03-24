import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
  createReader,
  ServerIO,
} from '@marblejs/core';
import { createServer, HttpServer } from '@marblejs/http';
import {
  eventBus,
  eventBusClient,
  EventBusClientToken,
  EventBusToken,
} from '@marblejs/messaging';
import { defaultServerConfig, ServerConfig } from './config';
import { eventBusListener } from './eventbus.listener';
import { listener } from './http.listener';
import { ServerConfigToken } from './tokens';

/**
 * Creates the server from the given `config`.
 *
 * @param deps Dependencies for the server
 * @param config Server configuration
 */
export function server(
  deps: BoundDependency<unknown, ContextDependency>[],
  config: ServerConfig = defaultServerConfig,
): Promise<ServerIO<HttpServer>> {
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
