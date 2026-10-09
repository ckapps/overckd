#!/usr/bin/env node

import * as NodeRuntime from '@effect/platform-node/NodeRuntime';
import * as NodeServices from '@effect/platform-node/NodeServices';
import { Config, Effect, Layer, Option } from 'effect';
import { Command, Flag } from 'effect/cli';
import { ConfigLive } from './common/config';
import { OverckdReposLive } from './repositories/repositories';
import { OverckdHttpServerLive } from './server/server';
import { ApiVersions } from './server/server.config';

// The flags override the environment and the config file (see `ConfigLive`),
// so they have no defaults: the defaults live in the sections.

const config = Flag.File('config', { mustExist: true }).pipe(
  Flag.withAlias('c'),
  Flag.withDescription('Config file (YAML)'),
  Flag.withFallbackConfig(Config.String('OVERCKD_CONFIG')),
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

export const command = Command.make(
  'overckd',
  { config, port, apiVersion },
  ({ config, port, apiVersion }) =>
    OverckdHttpServerLive.pipe(
      Layer.provide(OverckdReposLive),
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
