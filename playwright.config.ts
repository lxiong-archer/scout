import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'line',
  projects: [
    /* 🖥️ SCOUT WEB TRACK */
    {
      name: 'scout-web',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },

    /* 📱 SCOUT MOBILE TRACK */
    {
      name: 'scout-mobile',
      use: { 
        ...devices['iPhone 15 Pro Max'], 
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});