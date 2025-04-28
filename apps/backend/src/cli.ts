#!/usr/bin/env node

import { Command, Options } from '@effect/cli';
import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import * as NodeRuntime from '@effect/platform-node/NodeRuntime';
import * as Config from 'effect/Config';
import * as Effect from 'effect/Effect';
import * as Fn from 'effect/Function';
import * as Layer from 'effect/Layer';
import * as Logger from 'effect/Logger';
import * as LogLevel from 'effect/LogLevel';
import * as Schema from 'effect/Schema';
import { createServer } from 'node:http';
import { OverckdBackend } from './main';

const main = OverckdBackend.pipe(
  Layer.launch,
  Effect.catchAll(e => Effect.logError('Uncaught error', e)),
  Effect.catchAllDefect(e => Effect.logFatal('Defect', e)),
);

const port = Options.integer('port').pipe(
  Options.withAlias('p'),
  Options.withDefault(3000),
  Options.withDescription('Port to run the server on'),
  Options.withFallbackConfig(Config.integer('PORT')),
);

const logLevelSchema: Schema.Schema<LogLevel.Literal> = Schema.Literal(
  ...LogLevel.allLevels.map(level => level._tag),
);

const logLevel = Options.text('logLevel').pipe(
  Options.withSchema(logLevelSchema),
  Options.withDefault('Info'),
);

export const command = Command.make(
  'overckd',
  { logLevel, port },
  ({ logLevel, port }) =>
    Fn.pipe(
      main,
      Logger.withMinimumLogLevel(LogLevel.fromLiteral(logLevel)),
      Effect.provide(
        Layer.mergeAll(NodeHttpServer.layer(createServer, { port })),
      ),
    ),
);

const run = Command.run(command, {
  name: 'overckd',
  version: '0.0.0',
});

run(process.argv).pipe(NodeRuntime.runMain);
