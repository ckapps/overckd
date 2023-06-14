import {
  BoundDependency,
  ContextDependency,
  bindEagerlyTo,
} from '@marblejs/core';
import { LogToken } from '@overckd/domain-rx';
import { ServerConfig, defaultServerConfig, server } from '@overckd/server';
import { IO } from 'fp-ts/lib/IO';
import { Dependencies, configureRepoDependencies } from './dependencies';
import { CustomLoggerReader } from './logger';

/**
 * Configure the dependencies that should be used
 * @param deps
 */
function configureDependencies(
  deps: Dependencies,
): BoundDependency<unknown, ContextDependency>[] {
  return [
    // Dependency for logging
    bindEagerlyTo(LogToken)(CustomLoggerReader),
    // Other tokens
    ...configureRepoDependencies(deps),
  ];
}

function initServerConfig(): ServerConfig {
  return {
    ...defaultServerConfig,
  };
}

// run the server
const main: IO<void> = async () =>
  await (
    await server(
      configureDependencies(Dependencies.InMemory),
      initServerConfig(),
    )
  )();

main();
