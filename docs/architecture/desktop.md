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

> **Status:** target. Today the main process starts the legacy marble server
> (`libs/server`) on a TCP port, backed by an in-memory rxdb seeded from YAML,
> and `apps/desktop/src/app/legacy/protocol.ts` holds a stub that uses the
> deprecated `protocol.registerStringProtocol`.

## Main process

```ts
// apps/desktop/src/app/api.protocol.ts
import * as NodeHttpServer from '@effect/platform-node/NodeHttpServer';
import { OverckdApi } from '@overckd/api-http';
import { CollectionRepoFs } from '@overckd/collection/adapter-fs';
import { CollectionHttpController } from '@overckd/collection/adapter-http-server';
import { CollectionCommandsLocal, CollectionQueriesLocal } from '@overckd/collection/application';
import { Layer } from 'effect';
import { HttpRouter } from 'effect/http';
import { HttpApiBuilder } from 'effect/http-api';
import { app, protocol } from 'electron';

/** The same API as the backend: contract, handlers, local use cases. */
const ApiLive = HttpApiBuilder.layer(OverckdApi).pipe(Layer.provide(CollectionHttpController), Layer.provide([CollectionQueriesLocal, CollectionCommandsLocal]));

export const start = (dataDir: string) => {
  // Must run before the app is ready.
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'overckd',
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
      },
    },
  ]);

  const { handler, dispose } = HttpRouter.toWebHandler(
    Layer.mergeAll(ApiLive, HttpRouter.cors()).pipe(
      Layer.provide(CollectionRepoFs({ file: `${dataDir}/overckd.collections.yaml` })),
      // Node services + HTTP platform services, but no TCP server.
      Layer.provide(NodeHttpServer.layerHttpServices),
    ),
  );

  void app.whenReady().then(() => protocol.handle('overckd', handler));
  app.on('will-quit', () => void dispose());
};
```

- `registerSchemesAsPrivileged` has to run before the `ready` event.
  `standard` makes `overckd://app/api/…` parse like an http URL (host `app`),
  `secure` treats it as a secure context, `supportFetchAPI` allows `fetch`, and
  `corsEnabled` allows cross-origin calls from the renderer.
- `HttpRouter.toWebHandler` turns the layer into a Fetch-style
  `(Request) => Promise<Response>` handler, which is exactly what
  `protocol.handle` expects. The layer is built immediately; `dispose` releases
  it on quit.
- `NodeHttpServer.layerHttpServices` provides the Node services (file system,
  path, …) and the HTTP platform services without starting a server.
- It wires the same contract, handlers and use cases as the backend; only the
  repositories, the transport and extras such as Swagger differ. As in the
  backend, forgetting a feature's handlers or use cases fails compilation (here
  at `protocol.handle`).

This path is covered by an in-memory test: the `*Http` implementations, running
over `FetchHttpClient`, call a `toWebHandler` handler for `overckd://app/api/…`
URLs, including a typed `CollectionNotFound` crossing the wire.

## Renderer

The renderer is `apps/frontend` built with the `desktop` configuration
(`environment.desktop.ts`). Its only difference is the API origin:

```ts
// apps/frontend/src/environments/environment.desktop.ts
export const environment = {
  production: false,
  apiUrl: 'overckd://app',
  shell: ApplicationShell.Desktop,
};
```

The renderer is loaded from `http://localhost:4200` during development and
from a `file://` URL when packaged. In both cases `overckd://app` is a different
origin, which is why the scheme is `corsEnabled` and the API layer includes
`HttpRouter.cors()`.

## Repositories

The main process chooses the repositories in its composition root, like any
other app: `CollectionRepoFs` to work directly on the user's YAML files (paths
from `overckd.config.yaml`), or `CollectionRepoRxdb` for a database. No other
code changes when the choice changes.

## Security

- `contextIsolation: true` and no `nodeIntegration` in the renderer.
- The preload script exposes only app-shell information. Business data flows
  only through `overckd://`, so there is no generic IPC surface.
- No TCP port: other local processes cannot reach the API.
