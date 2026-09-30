import nx from '@nx/eslint-plugin';

// -----------------------------------------------------------------------------
// Architecture rules (see docs/architecture/libraries.md, keep both in sync).
// Every project carries exactly one `type:*` tag (its role in the hexagon) and
// one `platform:*` tag (which runtime can execute its code). Which app uses
// which adapter is decided in the composition roots, not here.
// -----------------------------------------------------------------------------

/** Pre-architecture stacks: only `type:legacy` projects and apps may use them. */
const legacyStacks = ['fp-ts*', 'io-ts*', '@marblejs/*'];

/** Transport, persistence and UI technology: never inside domain or application. */
const technology = [
  'effect/http*',
  'effect/rpc*',
  'effect/sql*',
  '@effect/platform*',
  '@effect/sql*',
  'rxjs*',
  'rxdb*',
  '@angular/*',
  'electron',
];

/** Which roles a role may depend on. */
const typeConstraints = [
  {
    sourceTag: 'type:domain',
    onlyDependOnLibsWithTags: ['type:domain', 'type:util'],
    bannedExternalImports: [...legacyStacks, ...technology],
  },
  {
    sourceTag: 'type:application',
    onlyDependOnLibsWithTags: ['type:application', 'type:domain', 'type:util'],
    bannedExternalImports: [...legacyStacks, ...technology],
  },
  {
    sourceTag: 'type:contract',
    onlyDependOnLibsWithTags: ['type:contract', 'type:domain', 'type:util'],
    bannedExternalImports: [
      ...legacyStacks,
      '@angular/*',
      'rxjs*',
      'rxdb*',
      'electron',
    ],
  },
  {
    sourceTag: 'type:adapter',
    onlyDependOnLibsWithTags: [
      'type:application',
      'type:contract',
      'type:domain',
      'type:util',
    ],
    bannedExternalImports: legacyStacks,
  },
  {
    // Angular access to the ports: bindings derived from them, stores.
    sourceTag: 'type:data-access',
    onlyDependOnLibsWithTags: [
      'type:data-access',
      'type:application',
      'type:domain',
      'type:util',
    ],
    bannedExternalImports: legacyStacks,
  },
  {
    sourceTag: 'type:ui',
    onlyDependOnLibsWithTags: ['type:ui', 'type:domain', 'type:util'],
    bannedExternalImports: legacyStacks,
  },
  {
    // Pages depend inwards only; they reach the ports through data-access.
    sourceTag: 'type:feature',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:data-access',
      'type:ui',
      'type:domain',
      'type:util',
    ],
    bannedExternalImports: legacyStacks,
  },
  {
    sourceTag: 'type:util',
    onlyDependOnLibsWithTags: ['type:util'],
    bannedExternalImports: legacyStacks,
  },
  // Composition roots wire everything together.
  { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['*'] },
  // Frozen pre-architecture code; may bridge into the new code (strangler).
  { sourceTag: 'type:legacy', onlyDependOnLibsWithTags: ['*'] },
];

/** Which runtime a project's code can execute on. */
const platformConstraints = [
  {
    // Plain TypeScript + effect; platform capabilities arrive as services.
    sourceTag: 'platform:any',
    onlyDependOnLibsWithTags: ['platform:any'],
    bannedExternalImports: ['@angular/*', 'electron', '@effect/platform*'],
  },
  {
    sourceTag: 'platform:node',
    onlyDependOnLibsWithTags: ['platform:node', 'platform:any'],
    bannedExternalImports: ['@angular/*', '@effect/platform-browser*'],
  },
  {
    sourceTag: 'platform:browser',
    onlyDependOnLibsWithTags: ['platform:browser', 'platform:any'],
    bannedExternalImports: ['electron', '@effect/platform-node*'],
  },
];

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [...typeConstraints, ...platformConstraints],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {
      'no-extra-semi': 'off',
    },
  },
];
