import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// 🎯 Target aviation web apps to track
const TARGETS = [
  { name: 'atc', url: 'https://www.atc.com/' },
  { name: 'planefinder', url: 'https://planefinder.net/' }
];

for (const app of TARGETS) {
  test(`Deploying Scout to analyze ${app.name}`, async ({ page }, testInfo) => {
    // Parses out 'web' or 'mobile' from your project environment
    const viewportType = testInfo.project.name.replace('scout-', ''); 
    const formattedDate = new Date().toISOString().split('T')[0].replace(/-/g, '');

    // Ensure the output directory exists locally
    const outputDir = path.join(__dirname, '../tracked-screens');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ──────────────────────────────────────────────────────────────
    // 🛠️ STATE 1: LANDING PAGE
    // ──────────────────────────────────────────────────────────────
    await page.goto(app.url, { waitUntil: 'networkidle' });
    
    const landingName = `${app.name.toLowerCase()}-${viewportType}-landing-${formattedDate}.png`;
    const localLandingPath = path.join(outputDir, landingName);

    await page.screenshot({ path: localLandingPath, fullPage: true });
    console.log(`📸 Screenshot saved locally: ${landingName}`);

    // ──────────────────────────────────────────────────────────────
    // 🛠️ STATE 2: LOGIN STATE (WITH OVERLAY PROTECTION)
    // ──────────────────────────────────────────────────────────────
    const loginBtn = page.locator('text=Log in').first();
    if (await loginBtn.isVisible()) {
      try {
        await loginBtn.click({ force: true, timeout: 5000 });
        await page.waitForTimeout(2000); 
        
        const loginStateName = `${app.name.toLowerCase()}-${viewportType}-loginstate-${formattedDate}.png`;
        const localLoginPath = path.join(outputDir, loginStateName);

        await page.screenshot({ path: localLoginPath });
        console.log(`📸 Screenshot saved locally: ${loginStateName}`);
      } catch (clickError) {
        console.log(`⚠️ Skipping deeper click state for ${app.name}: Button action obstructed.`);
      }
    }
  });
}