import { BoundDependency, ContextDependency } from '@marblejs/core';

/* eslint-disable @typescript-eslint/no-var-requires */
export enum Dependencies {
  InMemory,
}

export function configureRepoDependencies(
  deps: Dependencies,
): BoundDependency<any, ContextDependency>[] {
  switch (deps) {
    case Dependencies.InMemory:
      return require('./in-memory').configure();
    default:
      return [];
  }
}
