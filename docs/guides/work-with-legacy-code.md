# Work with legacy code

Parts of the code base predate the architecture. They are migrated feature by
feature (strangler pattern), not rewritten in one go.

## Recognizing legacy code

- Projects tagged `type:legacy` (see the
  [mapping](../architecture/libraries.md#current-to-target-mapping)): `domain`
  (`@overckd/domain`), `domain-rx`, `server`, `yaml`, the `*-infra-rxdb` libs and
  `collection-ui`.
- Code built on fp-ts, io-ts, rxjs services or marblejs.
- Inside apps: `apps/server-cli`, `apps/desktop/src/app/legacy`, and the
  frontend's abstract-class services (`RecipeCollectionService`,
  `AppRecipeCollectionService`, …).

`collection-ui` and the `*-infra-rxdb` libs are tagged legacy only because they
still use the legacy domain types; they have a place in the target layout.

## Rules

- **Don't add features to legacy code.** Bug fixes are fine.
- **New code never imports legacy code.** Lint enforces it: only `type:legacy`
  and `type:app` projects may depend on `type:legacy`, and only they may import
  fp-ts, io-ts or marblejs.
- **Legacy code may call new code.** That is how the migration works.
- When a change would require extending legacy code substantially, migrate the
  affected part first.
- When a lib no longer uses anything legacy, change its `type:legacy` tag to its
  real role in the same change.

## The bridge pattern

`libs/domain-rx` already runs the new use cases inside the legacy marblejs
server: `RecipeCollectionRepoMarbleInterop` implements the new
`CollectionRepo` port with the legacy repository, and the marble effects run
`CollectionUseCase` through `Effect.runPromise`. Bridges like this are allowed in
legacy code (and only there), so a feature can switch to the new core before
its surroundings are migrated.

## Migration order

Per feature (collection first; it is the furthest along):

1. **Domain**: models, ids and errors in `libs/@overckd/domain-experimental`
   (done for collection, recipe, tag and ingredient). Move HTTP status codes
   from the error definitions (`httpApiStatus`) into the contracts
   (`HttpApiSchema.status`).
2. **Application**: split `<Feature>UseCase` into `<Feature>Queries` /
   `<Feature>Commands` ports declared by interface, plus `*Local` layers; use
   `'@overckd/<feature>/<role>/<Name>'` keys. Handlers then depend on the ports
   instead of providing `<Feature>UseCase.layer` themselves, and
   `apps/backend` provides the `*Local` layers.
3. **Layout**: move the libs to `libs/@overckd/<feature>/<role>` (core) and
   `libs/@overckd-app/<feature>/<role>` (Angular) with `nx g @nx/workspace:move`
   (check with `--dry-run`), and switch the import aliases to match the paths
   (`@overckd/<feature>/<role>`, `@overckd-app/<feature>/<role>`).
4. **Repositories**: `adapter-memory` (replacing the stub repos in
   `apps/backend/src/*.repo.ts`), `@overckd/codec-yaml` (the domain file
   codecs of `libs/yaml`, ported from io-ts to Effect Schema; its app config
   codecs move to the apps) and `adapter-fs` on top of it (replacing the
   desktop's filesystem readers), `adapter-rxdb` (from `*-infra-rxdb`, on the new
   domain).
5. **Frontend**: `libs/@ckapp/angular-effect`, then per feature
   `adapter-http-client` and `data-access`; switch pages to the bindings, move
   `collection-ui` to the new domain types, delete the abstract services
   ([frontend](../architecture/frontend.md#migration-from-today)).
6. **Desktop**: wire the API in `apps/desktop` and serve it over `overckd://`
   ([desktop](../architecture/desktop.md#migration-from-today)).
7. **Cleanup**: delete `domain-rx`, `server`, `yaml`, `apps/server-cli` and the
   legacy `libs/domain`; then rename `libs/@overckd/domain-experimental` to
   `libs/@overckd/domain` (`@overckd/domain`).
