# Frontend (Angular)

The Angular app (`apps/frontend`) is a driving adapter: pages call the inbound
ports, which in the browser are the remote `*Http` implementations. The same app
is the renderer of the desktop app; only its API base URL differs.

**Pages never touch the Effect runtime.** They depend inwards on their feature's
`data-access` lib, which exposes the ports as Angular resources and promises.
The bridge in `libs/@ckapp/angular-effect` is the only Angular code that runs
effects.

```
page (feature lib) ─▶ data-access ─▶ bridge (injectQueries / injectCommands) ─▶ port
                                                                               └─ CollectionQueriesHttp ─▶ API
```

| Lib                                          | Contains                               | May use                                                     |
| -------------------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| `libs/@overckd-app/<feature>/feature-<name>` | routed pages, smart components         | data-access, ui, domain                                     |
| `libs/@overckd-app/<feature>/ui`             | presentational components              | ui, domain                                                  |
| `libs/@overckd-app/<feature>/data-access`    | `inject<Port>()` bindings, NgRx stores | ports (application lib), the bridge, other data-access libs |
| `libs/@ckapp/angular-effect`                 | the bridge                             | `effect`, Angular                                           |

"Data access" is Nx's name for this library type: the frontend's access to data,
which here always goes through the ports. It is not about persistence; that is
the repositories' job.

> **Status:** target. Today the pages use abstract-class services
> (`RecipeCollectionService`) implemented with Angular's `HttpClient` and the
> legacy domain types. See [migration](#migration-from-today).

## Composition root

`app.config.ts` decides which implementation backs each port and builds one
runtime for the whole app:

```ts
// apps/frontend/src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { CollectionCommandsHttp, CollectionQueriesHttp } from '@overckd/collection/adapter-http-client';
import { provideEffectRuntime } from '@ckapp/angular-effect';
import { Effect, Layer } from 'effect';
import { FetchHttpClient, HttpClient, HttpClientRequest } from 'effect/http';
import { environment } from '../environments/environment';

/** The HttpClient every *Http implementation uses, pointed at the API origin. */
const ApiHttpClient = (baseUrl: string) => Layer.effect(HttpClient.HttpClient, Effect.map(HttpClient.HttpClient, HttpClient.mapRequest(HttpClientRequest.prependUrl(baseUrl)))).pipe(Layer.provide(FetchHttpClient.layer));

export const appConfig: ApplicationConfig = {
  providers: [provideEffectRuntime(Layer.mergeAll(CollectionQueriesHttp, CollectionCommandsHttp).pipe(Layer.provide(ApiHttpClient(environment.apiUrl))))],
};
```

`environment.apiUrl` is the API **origin**; the contract already contains the
`/api` prefix:

| Build   | `apiUrl`          | Requests go to                                                           |
| ------- | ----------------- | ------------------------------------------------------------------------ |
| web     | `''`              | `/api/…` on the page's origin (relative URLs resolve against `location`) |
| desktop | `'overckd://app'` | the Electron main process, see [desktop](desktop.md)                     |

The runtime is not statically typed against the bindings: if a page uses a port
that the composition root does not provide, the call fails with a defect at
runtime. When you add a feature, add its `*Http` layers here.

## The bridge: `libs/@ckapp/angular-effect`

The only code that connects Angular and Effect. It builds one `ManagedRuntime`
from the app's layer, disposes it with the app, and **derives** the Angular API
of a port from the port's type, so nobody writes facades by hand.

```ts
// libs/@ckapp/angular-effect/src/lib/angular-effect.ts
import { DestroyRef, EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, resource, ResourceRef, Signal } from '@angular/core';
import { Context, Effect, Layer, ManagedRuntime } from 'effect';

const MANAGED_RUNTIME = new InjectionToken<ManagedRuntime.ManagedRuntime<unknown, unknown>>('overckd/ManagedRuntime');

/** Builds one ManagedRuntime for the app and disposes it with the app. */
export function provideEffectRuntime<R, E>(layer: Layer.Layer<R, E>): EnvironmentProviders {
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
  readonly [K in keyof S]: S[K] extends Effect.Effect<infer A, unknown, never> ? () => ResourceRef<A | undefined> : S[K] extends (...args: infer P) => Effect.Effect<infer A, unknown, never> ? (...args: { readonly [I in keyof P]: Signal<P[I] | undefined> }) => ResourceRef<A | undefined> : never;
};

/** A commands port as promises that reject with the port's typed error. */
export type CommandBindings<S> = {
  readonly [K in keyof S]: S[K] extends (...args: infer P) => Effect.Effect<infer A, unknown, never> ? (...args: P) => Promise<A> : never;
};

/** Calls a port member: a method with arguments, or an effect value. */
const call = (service: unknown, key: PropertyKey, args: ReadonlyArray<unknown>): Effect.Effect<unknown, unknown> => {
  const member = (service as Record<PropertyKey, unknown>)[key];
  return (typeof member === 'function' ? member(...args) : member) as Effect.Effect<unknown, unknown>;
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
export function injectCommands<I, S>(port: Context.Key<I, S>): CommandBindings<S> {
  const runtime = inject(MANAGED_RUNTIME);
  return new Proxy({} as CommandBindings<S>, {
    get:
      (_, key) =>
      (...args: ReadonlyArray<unknown>) =>
        runtime.runPromise(Effect.flatMap(port, service => call(service, key, args))),
  });
}
```

- The mapped types decide what can be called; at runtime a `Proxy` looks the
  member up by name. A port member that requires services (`R ≠ never`) maps to
  `never`, which is one more reason ports require nothing.
- A failed effect rejects with the squashed cause: the typed error instance for
  expected failures, the defect otherwise. On a resource it appears as
  `.error()`.
- Angular's `resource()` is still marked experimental in Angular 21.

## Data access: bindings and stores

Each feature's `data-access` lib exports one binding per port. That is the whole
layer between pages and ports:

```ts
// libs/@overckd-app/collection/data-access/src/lib/collection.bindings.ts
import { CollectionCommands, CollectionQueries } from '@overckd/collection/application';
import { injectCommands, injectQueries } from '@ckapp/angular-effect';

/** The collection queries as Angular resources. Call in an injection context. */
export const injectCollectionQueries = () => injectQueries(CollectionQueries);

/** The collection commands as promises. Call in an injection context. */
export const injectCollectionCommands = () => injectCommands(CollectionCommands);
```

The bindings follow the ports: a new port method is available to pages without
touching this lib. What pages get:

| Port member                                                                          | Binding                                                                                            |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `getAll: Effect<ReadonlyArray<Collection>>`                                          | `getAll(): ResourceRef<ReadonlyArray<Collection> \| undefined>`                                    |
| `findById: (id: CollectionId) => Effect<Collection, CollectionNotFound>`             | `findById(id: Signal<CollectionId \| undefined>): ResourceRef<Collection \| undefined>`            |
| `rename: (id: CollectionId, name: string) => Effect<Collection, CollectionNotFound>` | `rename(id: CollectionId, name: string): Promise<Collection>`, rejecting with `CollectionNotFound` |

**Stores.** When several components share client state (selection, filters,
drafts, …), add NgRx stores to the `data-access` lib. They read and change data
only through the bindings: server data stays behind the ports, and a store adds
client state on top. A data-access lib may use another feature's data-access
lib, so stores can build on each other; a store that belongs to no single
feature lives in `libs/@overckd-app/data-access`.

## Pages and components

`feature-*` libs hold routed pages and smart components; they get data only
from `data-access`. `ui` libs hold presentational components: signal inputs,
outputs and domain types, nothing else.

```ts
// libs/@overckd-app/collection/feature-collection/src/lib/collection-page.component.ts
import { Component, input } from '@angular/core';
import { injectCollectionCommands, injectCollectionQueries } from '@overckd-app/collection/data-access';
import { CollectionId, CollectionNotFound } from '@overckd/domain';

@Component({
  selector: 'overckd-collection-page',
  template: `
    @if (collection.value(); as c) {
    <h1>{{ c.name }}</h1>
    } @else if (collection.error()) {
    <p>Could not load this collection.</p>
    }
  `,
})
export class CollectionPageComponent {
  readonly id = input.required<CollectionId>();

  readonly #queries = injectCollectionQueries();
  readonly #commands = injectCollectionCommands();

  protected readonly collection = this.#queries.findById(this.id);

  protected async rename(name: string): Promise<void> {
    try {
      await this.#commands.rename(this.id(), name);
      this.collection.reload();
    } catch (error) {
      if (error instanceof CollectionNotFound) {
        // typed, user-actionable error: tell the user
        return;
      }
      throw error; // defect: let the global error handler deal with it
    }
  }
}
```

Components may use Effect's data modules (`Option`, `Array`, `Match`) to render
domain values, but never `Effect`, `Layer` or a runtime.

## What goes away

- Abstract-class "ports" in Angular DI (`RecipeCollectionService`,
  `RecipeService`) and their `HttpClient` implementations: swapping
  implementations happens in Effect layers, not Angular DI.
- `UrlBuilderService` (only used by those services) and `ApiRequestService`
  (unused): the contract builds the URLs.
- Legacy domain types (`@overckd/domain`) in components.

## Migration from today

1. Create `libs/@ckapp/angular-effect` with the bridge above.
2. Per feature: add `adapter-http-client` and `data-access`, register the
   `*Http` layers in `app.config.ts`.
3. Switch pages from the abstract services to the data-access bindings; move
   presentational components to the new domain types (`collection-ui` today).
4. Change `environment*.ts`: `apiUrl` becomes the origin (`''` on the web,
   `'overckd://app'` on the desktop).
5. Delete the old services, `UrlBuilderService` and `ApiRequestService`.
