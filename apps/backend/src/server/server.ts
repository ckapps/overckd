import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { Layer } from 'effect';
import { createServer } from 'node:http';
import { MediaConfig } from '../media/media.config';
import { OverckdHttpApiLive } from './app.http';
import { ServerConfig } from './server.config';

/** The HTTP server, on the port of `ServerConfig`. */
export const ServerLive = Layer.unwrap(
  ServerConfig.useSync(({ port }) =>
    NodeHttpServer.layer(createServer, { port }),
  ),
);

export const OverckdHttpServerLive = OverckdHttpApiLive.pipe(
  Layer.provide(ServerLive),
  Layer.provide([ServerConfig.layer, MediaConfig.layer]),
);
