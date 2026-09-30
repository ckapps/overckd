# Architecture

overckd is a hexagonal (ports & adapters) architecture built on Effect v4. Read [docs/README.md](docs/README.md) before changing code, and follow the guides in [docs/guides/](docs/guides/) for common changes (adding an operation or a feature, touching legacy code). Before proposing a structural change, read [docs/decisions.md](docs/decisions.md): it lists what was decided and what was already rejected.

Rules (lint enforces what it can; check with `pnpm nx affected -t lint`):

- Ports are `Context.Service` tags declared by an explicit interface: inbound `<Feature>Queries` (reads) and `<Feature>Commands` (changes), outbound `<Feature>Repo`. Implementations are separate Layers named `<Port><Impl>` (`Local`, `Http`, `Fs`, `Rxdb`, `Memory`), never statics on the tag.
- Port methods require nothing (`R = never`) and declare only errors the user can act on; adapters turn infrastructure failures into defects. HTTP status codes live in the contract.
- New libs go to `libs/@overckd/<feature>/<role>` (the Effect core: domain, ports, contracts such as `api-http` and `codec-yaml`, adapters) or `libs/@overckd-app/<feature>/<role>` (app-specific: Angular data-access, ui, pages); generic code that isn't about recipes goes to `libs/@ckapp`. Paths equal import aliases, one Nx lib per role; today's projects are mapped in [docs/architecture/libraries.md](docs/architecture/libraries.md). Every project has one `type:*` tag (its role) and one `platform:*` tag (`any`, `node` or `browser`: where its code can run). When lint rejects an import, move the code; don't loosen `eslint.config.mjs`.
- Schemas that cross a port or the wire (models, inputs, errors) live in the domain lib (today `libs/@overckd/domain-experimental`); business rules are pure functions there.
- Only the apps (composition roots) choose implementations. Effects run only in the apps, the Angular bridge (`libs/@ckapp/angular-effect`) and tests; libraries never call `Effect.runPromise`.
- Angular pages never touch the Effect runtime: they depend on their feature's `data-access` lib, whose `inject<Port>()` bindings are derived from the ports (queries return `ResourceRef`, commands return `Promise`), plus NgRx stores for shared client state. Feature libs never import ports or adapters.
- `type:legacy` code (fp-ts, io-ts, rxjs services, marblejs) is frozen; new code must not import it.
- Effect is version 4 (`4.0.0-rc.118`), which differs a lot from version 3: check `node_modules/effect/CLAUDE.md`, `node_modules/effect/ai-docs/src/` and the `.d.ts` files instead of relying on memory.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
