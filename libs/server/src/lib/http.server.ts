import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
  createReader,
  ServerIO,
} from '@marblejs/core';
import { createServer, HttpServer } from '@marblejs/http';
import {
  EventBus,
  EventBusClient,
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
      ...deps,
      bindEagerlyTo(EventBusToken)(EventBus({ listener: eventBusListener })),
      bindEagerlyTo(EventBusClientToken)(EventBusClient),
      bindEagerlyTo(ServerConfigToken)(ServerConfigReader),
    ],
  });
}
