# Desktop (Electron)

The desktop app combines the frontend and the backend in one Electron
application, without opening a TCP port. The **renderer** runs the unchanged
frontend; the **main process** serves the same HTTP API as the backend through
a custom `overckd://` protocol.

| Process  | Role                                                                                                                     | Code                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| main     | server-side composition root: the API (contract, handlers, local use cases) + repositories, served via `protocol.handle` | `apps/desktop`                             |
| renderer | the frontend app, built with the `desktop` configuration                                                                 | `apps/frontend`                            |
| preload  | minimal bridge for app-shell information (version, platform); no business data                                           | `apps/desktop/src/app/api/main.preload.ts` |

```
renderer  page ─▶ data-access ─▶ CollectionQueriesHttp ── fetch overckd://app/api/… ──┐
main      protocol.handle('overckd', handler) ─▶ CollectionHttpController ◀───────────┘
            ─▶ CollectionQueriesLocal ─▶ CollectionRepoFs (YAML files)
```

## Main process

```ts
// apps/desktop/src/app/protocol/schemes.ts
/** Registers the schemes of the API and the packaged renderer. Must run before the app is ready. */
export const registerSchemes = () =>
  protocol.registerSchemesAsPrivileged([
    { scheme: 'overckd', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true } },
    { scheme: 'overckd-app', privileges: { standard: true, secure: true, supportFetchAPI: true } },
  ]);

// apps/desktop/src/app/protocol/api.protocol.ts
/** The same API as the backend (contract, handlers, local use cases) and the images, on the files of the app directory. */
export const ApiLive = Layer.mergeAll(HttpApiBuilder.layer(OverckdApi).pipe(Layer.provide([CollectionHttpController, RecipeHttpController])), MediaLive, HttpRouter.cors()).pipe(Layer.provide([CollectionQueriesLocal, RecipeQueriesLocal]), Layer.provide(RepositoriesLive('overckd://app/images')));

/** Serves `ApiLive` over `overckd://` while the layer lives. */
export const ApiProtocolLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const { handler, dispose } = HttpRouter.toWebHandler(
      ApiLive.pipe(
        Layer.provide(Layer.succeed(AppDirectory, yield* AppDirectory)),
        // Node services + HTTP platform services, but no TCP server.
        Layer.provide(NodeHttpServer.layerHttpServices),
      ),
    );
    protocol.handle('overckd', request => handler(request));
    yield* Effect.addFinalizer(() =>
      Effect.promise(() => {
        protocol.unhandle('overckd');
        return dispose();
      }),
    );
  }),
);

// apps/desktop/src/app/start.ts
export function start(): Promise<void> {
  registerSchemes();
  // ApiProtocolLive on the app directory of the config, with logging
  const runtime = ManagedRuntime.make(MainLive);
  app.on('will-quit', () => void runtime.dispose());
  return app.whenReady().then(() => runtime.context());
}
```

- `registerSchemesAsPrivileged` has to run before the `ready` event.
  `standard` makes `overckd://app/api/…` parse like an http URL (host `app`),
  `secure` treats it as a secure context, `supportFetchAPI` allows `fetch`, and
  `corsEnabled` allows cross-origin calls from the renderer. `overckd-app` is
  the scheme of the packaged renderer ([renderer](#renderer)).
- `HttpRouter.toWebHandler` turns the layer into a Fetch-style
  `(Request) => Promise<Response>` handler, which is exactly what
  `protocol.handle` expects. The main process builds its layers in one
  `ManagedRuntime` once the app is ready, and disposes it on quit, which
  unhandles the scheme and releases the API's layer.
- `NodeHttpServer.layerHttpServices` provides the Node services (file system,
  path, …) and the HTTP platform services without starting a server.
- It wires the same contract, handlers and use cases as the backend; only the
  repositories, the transport and extras such as Swagger differ. As in the
  backend, forgetting a feature's handlers or use cases fails compilation.
- The images of the app directory are served under `overckd://app/images`,
  where the recipes link them.

This path is covered by an in-memory test: the `*Http` implementations, running
over `FetchHttpClient`, call a `toWebHandler` handler for `overckd://app/api/…`
URLs, including a typed `CollectionNotFound` crossing the wire.

## Renderer

The renderer is `apps/frontend` built with the `desktop` configuration
(`environment.desktop.ts`). Its only difference is the API origin:

```ts
// apps/frontend/src/environments/environment.desktop.ts
export const environment: FrontendEnvironment = {
  production: false,
  shell: ApplicationShell.Desktop,
  api: { url: 'overckd://app' },
};
```

The renderer is loaded from `http://localhost:4200` during development. The
packaged app loads it from `overckd-app://app`, where the main process serves
the renderer's files (`RendererProtocolLive`): a page from `file://` can't fetch
`overckd://`. In both cases `overckd://app` is a different origin, which is why
the scheme is `corsEnabled` and the API layer includes `HttpRouter.cors()`.

## Repositories

The main process chooses the repositories in its composition root, like any
other app: `RecipeRepoFs` and `CollectionRepoFs` work directly on the YAML
files of the app directory that `overckd.config.yaml` names (`app.dir`); a
database adapter such as `CollectionRepoRxdb` would take their place there. No
other code changes when the choice changes.

## Security

- `contextIsolation: true` and no `nodeIntegration` in the renderer.
- The preload script exposes only app-shell information. Business data flows
  only through `overckd://`, so there is no generic IPC surface.
- No TCP port: other local processes cannot reach the API.
