import { defineConfig } from 'vitest/config';
import baseConfig from './vite.config';

// Spread the existing Vite config and add test-specific options.
// We cast baseConfig to `any` because the Vite config can be a function or
// a promise in some setups; spreading as any keeps this file simple and
// avoids complex type incompatibilities with mergeConfig.
export default defineConfig({
  ...(baseConfig as any),
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      all: true,
      src: ['src']
    }
  }
});
