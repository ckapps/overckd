// Merges the per-project lcov reports into a single `coverage/lcov.info`.
//
// Vitest runs with the project root as cwd, so `SF:` entries are relative to
// the project. This rewrites them to be relative to the workspace root, which
// is what Coveralls expects. Project roots and report locations are taken from
// the Nx project graph, so no per-project mapping has to be maintained here.
//
// Interim solution until the Nx 23 upgrade: then a root `vitest.config.mts`
// with `test.projects` produces a single report and this script can go.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, posix } from 'node:path';

const graphFile = join(mkdtempSync(join(tmpdir(), 'nx-graph-')), 'graph.json');
execFileSync('pnpm', ['nx', 'graph', `--file=${graphFile}`], {
  stdio: 'ignore',
});
const { nodes } = JSON.parse(readFileSync(graphFile, 'utf8')).graph;

const merged = [];
for (const { name, data } of Object.values(nodes)) {
  for (const output of data.targets?.test?.outputs ?? []) {
    const reportsDirectory = output
      .replace('{workspaceRoot}/', '')
      .replace('{projectRoot}', data.root);
    const lcovFile = join(reportsDirectory, 'lcov.info');
    if (!existsSync(lcovFile)) continue;

    const lcov = readFileSync(lcovFile, 'utf8').replace(
      /^SF:(.+)$/gm,
      (_, file) => `SF:${posix.join(data.root, file)}`,
    );
    merged.push(lcov.trimEnd());
    console.log(`${name}: ${lcovFile}`);
  }
}

if (merged.length === 0) {
  console.error('No lcov reports found');
  process.exit(1);
}

writeFileSync('coverage/lcov.info', merged.join('\n') + '\n');
console.log(`Merged ${merged.length} reports into coverage/lcov.info`);
