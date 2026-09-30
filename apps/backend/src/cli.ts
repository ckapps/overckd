#!/usr/bin/env node

import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import * as NodeRuntime from '@effect/platform-node/NodeRuntime';
import * as NodeServices from '@effect/platform-node/NodeServices';
import {
  Config,
  Effect,
  Function as Fn,
  Layer,
  LogLevel,
  References,
  Schema,
} from 'effect';
import { Command, Flag } from 'effect/cli';
import { createServer } from 'node:http';
import { OverckdBackend } from './main';

const main = OverckdBackend.pipe(
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

const logLevelSchema = Schema.Literals(LogLevel.values);

const logLevel = Flag.String('logLevel').pipe(
  Flag.withSchema(logLevelSchema),
  Flag.withDefault('Info'),
);

export const command = Command.make(
  'overckd',
  { logLevel, port },
  ({ logLevel, port }) =>
    Fn.pipe(
      main,
      Effect.provideService(References.MinimumLogLevel, logLevel),
      Effect.provide(
        Layer.mergeAll(NodeHttpServer.layer(createServer, { port })),
      ),
    ),
);

const run = Command.run(command, {
  version: '0.0.0',
});

run.pipe(Effect.provide(NodeServices.layer), NodeRuntime.runMain);
