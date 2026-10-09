import * as NodeServices from '@effect/platform-node/NodeServices';
import { Effect, Layer } from 'effect';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ElectronPaths } from './electron-paths';
import { LoggingLive, logFileName } from './logging';

let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'overckd-logs-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('LoggingLive', () => {
  it('writes the log to main.log in the logs directory', async () => {
    const logs = join(dir, 'Logs', 'overckd');

    await Effect.runPromise(
      Effect.logInfo('overckd is ready').pipe(
        Effect.provide(
          LoggingLive.pipe(
            Layer.provide(
              Layer.succeed(
                ElectronPaths,
                ElectronPaths.of({ userData: dir, logs }),
              ),
            ),
            Layer.provide(NodeServices.layer),
          ),
        ),
      ),
    );

    expect(logFileName).toBe('main.log');
    expect(await readFile(join(logs, logFileName), 'utf8')).toContain(
      'overckd is ready',
    );
  });
});
