import { IO } from 'fp-ts/lib/IO';

import { server, ServerConfig, defaultServerConfig } from '@overckd/server';

import { configureRepoDependencies, Dependencies } from './dependencies';

/**
 * Configure the dependencies that should be used
 * @param deps
 */
function configureDependencies(deps: Dependencies) {
  const serverDeps = configureRepoDependencies(deps);
  return serverDeps;
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
