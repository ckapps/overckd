/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir:
    '../../../../node_modules/.vite/libs/@overckd-app/recipe/data-access',
  plugins: [angular(), nxViteTsPaths()],
  test: {
    name: 'overckd-app-recipe-data-access',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory:
        '../../../../coverage/libs/@overckd-app/recipe/data-access',
      provider: 'v8' as const,
    },
  },
}));
