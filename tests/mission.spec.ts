import { test } from '@playwright/test';

// 🎯 Add the target web apps you want Scout to track here
const TARGETS = [
  { name: 'Threads', url: 'https://www.threads.net' },
  { name: 'Airbnb', url: 'https://www.airbnb.com' }
];

for (const app of TARGETS) {
  test(`Deploying Scout to analyze ${app.name}`, async ({ page }, testInfo) => {
    const trackName = testInfo.project.name; // This will be 'scout-web' or 'scout-mobile'
    
    // 1. Dispatch Scout to the URL
    await page.goto(app.url, { waitUntil: 'networkidle' });
    
    // 2. Snap a full-page screenshot and save it into the correct Scout folder
    await page.screenshot({ 
      path: `./tracked-screens/${trackName}/${app.name}_01_landing.png`,
      fullPage: true 
    });

    // 3. Optional: Look for a standard login button to click and capture a deeper state
    const loginBtn = page.locator('text=Log in').first();
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      await page.waitForTimeout(2000); // Give the UI a 2-second buffer to animate open
      await page.screenshot({ 
        path: `./tracked-screens/${trackName}/${app.name}_02_login_state.png` 
      });
    }
  });
}