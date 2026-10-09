# Work with legacy code

Parts of the code base predate the architecture. They are migrated feature by
feature (strangler pattern), not rewritten in one go.

## Recognizing legacy code

- Projects tagged `type:legacy` (see the
  [mapping](../architecture/libraries.md#current-to-target-mapping)): `domain`
  (`@overckd/domain`), `yaml` and `collection-ui`.
- Code built on fp-ts, io-ts, rxjs services or marblejs.
- Inside apps: `apps/desktop/src/app/legacy`, and the
  frontend's abstract-class services (`RecipeCollectionService`,
  `AppRecipeCollectionService`, …).

`collection-ui` is tagged legacy only because it still uses the legacy domain
types; it has a place in the target layout.

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

A bridge runs the new use cases inside legacy code: a legacy repository
implements the new port (for example `CollectionRepo`), and the legacy effects
run the port's queries through `Effect.runPromise`. Bridges like this are
allowed in legacy code (and only there), so a feature can switch to the new
core before its surroundings are migrated.
