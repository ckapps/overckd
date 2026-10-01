#!/usr/bin/env node

import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import * as NodeRuntime from '@effect/platform-node/NodeRuntime';
import * as NodeServices from '@effect/platform-node/NodeServices';
import { Config, Effect, Function as Fn, Layer } from 'effect';
import { Command, Flag } from 'effect/cli';
import { createServer } from 'node:http';
import { ApiVersion, ApiVersions } from './app.http';
import { OverckdBackend } from './main';

const main = (version: ApiVersion) =>
  OverckdBackend(version).pipe(
    Layer.launch,
    Effect.catch(e => Effect.logError('Uncaught error', e)),
    Effect.catchDefect(e => Effect.logFatal('Defect', e)),
  );

const port = Flag.Int('port').pipe(
  Flag.withAlias('p'),
  Flag.withDefault(3000),
  Flag.withDescription('Port to run the server on'),
  Flag.withFallbackConfig(Config.Int('PORT')),
);

const apiVersion = Flag.Literals('api-version', ApiVersions).pipe(
  Flag.withDescription('Version of the HTTP API to serve'),
  // The fallback is read only while the flag has no default
  Flag.withFallbackConfig(Config.Literals(ApiVersions, 'API_VERSION')),
  Flag.withDefault('legacy'),
);

export const command = Command.make(
  'overckd',
  { port, apiVersion },
  ({ port, apiVersion }) =>
    Fn.pipe(
      main(apiVersion),
      Effect.provide(
        Layer.mergeAll(NodeHttpServer.layer(createServer, { port })),
      ),
    ),
);

const run = Command.run(command, {
  version: '0.0.0',
});

run.pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain);
