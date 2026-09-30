/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/@ckapp/angular-desktop',
  plugins: [angular(), nxViteTsPaths()],
  test: {
    name: 'ckapp-angular-desktop',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    // Spectator must share the inlined @angular/core/testing instance
    // that setupTestBed() initializes.
    server: { deps: { inline: ['@ngneat/spectator'] } },
    coverage: {
      reportsDirectory: '../../../coverage/libs/@ckapp/angular-desktop',
      provider: 'v8' as const,
    },
  },
}));
