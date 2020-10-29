/* eslint-disable @typescript-eslint/no-var-requires */
export enum Dependencies {
  InMemory,
}

export function configureRepoDependencies(deps: Dependencies) {
  switch (deps) {
    case Dependencies.InMemory:
      return require('./in-memory').configure();
    default:
      return [];
  }
}
