import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1,
  use: { baseURL: 'http://127.0.0.1:5173', channel: process.platform === 'win32' ? 'chrome' : undefined, viewport: { width: 390, height: 844 }, trace: 'retain-on-failure' },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: false,
    env: {
      VITE_SUPABASE_URL: 'https://gcc-test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_gcc_test_only',
      VITE_GOOGLE_AUTH_ENABLED: 'true',
    },
  },
});
