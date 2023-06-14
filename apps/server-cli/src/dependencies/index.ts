import { BoundDependency, ContextDependency } from '@marblejs/core';
import { configure } from './in-memory';

export enum Dependencies {
  InMemory,
}

export function configureRepoDependencies(
  deps: Dependencies,
): BoundDependency<any, ContextDependency>[] {
  switch (deps) {
    case Dependencies.InMemory:
      return configure();
    default:
      return [];
  }
}
