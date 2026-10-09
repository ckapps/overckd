import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  resource,
  ResourceRef,
  Signal,
} from '@angular/core';
import { Context, Effect, Layer, ManagedRuntime } from 'effect';

const MANAGED_RUNTIME = new InjectionToken<
  ManagedRuntime.ManagedRuntime<unknown, unknown>
>('@ckapp/angular-effect/ManagedRuntime');

/** Builds one ManagedRuntime for the app and disposes it with the app. */
export function provideEffectRuntime<R, E>(
  layer: Layer.Layer<R, E>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MANAGED_RUNTIME,
      useFactory: () => {
        const runtime = ManagedRuntime.make(layer);
        inject(DestroyRef).onDestroy(() => void runtime.dispose());
        return runtime;
      },
    },
  ]);
}

/** A queries port as Angular resources: every argument becomes a signal. */
export type QueryBindings<S> = {
  readonly [K in keyof S]: S[K] extends Effect.Effect<infer A, unknown, never>
    ? () => ResourceRef<A | undefined>
    : S[K] extends (...args: infer P) => Effect.Effect<infer A, unknown, never>
      ? (
          ...args: { readonly [I in keyof P]: Signal<P[I] | undefined> }
        ) => ResourceRef<A | undefined>
      : never;
};

/** A commands port as promises that reject with the port's typed error. */
export type CommandBindings<S> = {
  readonly [K in keyof S]: S[K] extends (
    ...args: infer P
  ) => Effect.Effect<infer A, unknown, never>
    ? (...args: P) => Promise<A>
    : never;
};

/** Calls a port member: a method with arguments, or an effect value. */
const call = (
  service: unknown,
  key: PropertyKey,
  args: ReadonlyArray<unknown>,
): Effect.Effect<unknown, unknown> => {
  const member = (service as Record<PropertyKey, unknown>)[key];
  return (
    typeof member === 'function' ? member(...args) : member
  ) as Effect.Effect<unknown, unknown>;
};

/**
 * Binds a queries port to Angular resources. Call it in an injection context.
 * A resource stays idle while any of its signals is `undefined`; a new value
 * interrupts the running effect.
 */
export function injectQueries<I, S>(port: Context.Key<I, S>): QueryBindings<S> {
  const runtime = inject(MANAGED_RUNTIME);
  return new Proxy({} as QueryBindings<S>, {
    get:
      (_, key) =>
      (...inputs: ReadonlyArray<Signal<unknown>>) =>
        resource({
          params: () => {
            const values = inputs.map(input => input());
            return values.includes(undefined) ? undefined : values;
          },
          loader: ({ params, abortSignal }) =>
            runtime.runPromise(
              Effect.flatMap(port, service => call(service, key, params)),
              { signal: abortSignal },
            ),
        }),
  });
}

/** Binds a commands port to promises. Call it in an injection context. */
export function injectCommands<I, S>(
  port: Context.Key<I, S>,
): CommandBindings<S> {
  const runtime = inject(MANAGED_RUNTIME);
  return new Proxy({} as CommandBindings<S>, {
    get:
      (_, key) =>
      (...args: ReadonlyArray<unknown>) =>
        runtime.runPromise(
          Effect.flatMap(port, service => call(service, key, args)),
        ),
  });
}
