import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',

    // Global test utilities
    globals: true,

    // Setup files
    setupFiles: ['./vitest.setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'out/',
        '**/*.config.ts',
        '**/*.config.js',
        '**/types/**',
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },

    // Exclude patterns
    exclude: [
      'node_modules',
      '.next',
      'out',
      'dist',
    ],

    // Test timeout
    testTimeout: 10000,
  },

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
