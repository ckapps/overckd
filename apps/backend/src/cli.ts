#!/usr/bin/env node

import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import * as NodeRuntime from '@effect/platform-node/NodeRuntime';
import * as NodeServices from '@effect/platform-node/NodeServices';
import { Effect, Layer, Option } from 'effect';
import { Command, Flag } from 'effect/cli';
import { createServer } from 'node:http';
import { ApiVersions } from './app.http';
import { ConfigLive } from './config/config';
import { ServerConfig } from './config/server.config';
import { OverckdBackend } from './main';

// The flags override the environment and the config file (see `ConfigLive`),
// so they have no defaults: the defaults live in the sections.

const config = Flag.File('config', { mustExist: true }).pipe(
  Flag.withAlias('c'),
  Flag.withDescription('Config file (YAML)'),
);

const port = Flag.Int('port').pipe(
  Flag.withAlias('p'),
  Flag.withDescription('Port to run the server on'),
  Flag.optional,
);

const apiVersion = Flag.Literals('api-version', ApiVersions).pipe(
  Flag.withDescription('Version of the HTTP API to serve'),
  Flag.optional,
);

/** The HTTP server, on the port of `ServerConfig`. */
const ServerLive = Layer.unwrap(
  ServerConfig.useSync(({ port }) =>
    NodeHttpServer.layer(createServer, { port }),
  ),
);

export const command = Command.make(
  'overckd',
  { config, port, apiVersion },
  ({ config, port, apiVersion }) =>
    OverckdBackend.pipe(
      Layer.provide(ServerLive),
      Layer.provide(ServerConfig.layer),
      Layer.provide(
        ConfigLive({
          file: config,
          flags: {
            server: {
              port: Option.getOrUndefined(port),
              apiVersion: Option.getOrUndefined(apiVersion),
            },
          },
        }),
      ),
      Layer.launch,
    ),
);

const run = Command.run(command, {
  version: '0.0.0',
});

run.pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain);
