import { IO } from 'fp-ts/lib/IO';
import { server, ServerConfig, defaultServerConfig } from '@overckd/server';
import { configureRepoDependencies, Dependencies } from './dependencies';
import { LogToken } from '@overckd/domain-rx';
import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
} from '@marblejs/core';
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
