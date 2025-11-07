// import { test as setup } from '@playwright/test';
// import path from 'path';
// import fs from 'fs';

// const authFile = path.resolve(__dirname, 'playwright/.auth/user.json');

// setup('authenticate', async ({ page }) => {
// console.log('🚀 Starting authentication setup...');

// try {
// await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
// console.log('🌐 Login page loaded.');

// await page.fill('input[placeholder="Enter your email or username"]', 'reviewer1');
// await page.fill('input[placeholder="Enter your password"]', 'password123');

// const signInButton = page.locator("//button[normalize-space()='Sign in']");
// await signInButton.waitFor({ state: 'visible', timeout: 10000 });
// await signInButton.click();
//     console.log('🔐 Clicked Sign in... waiting for redirect.');

//     await page.waitForURL(/(documents|dashboard)/, { timeout: 15000 });
//     console.log('✅ Login successful!');

//     const authDir = path.dirname(authFile);
//     if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

//     await page.context().storageState({ path: authFile });
//     console.log(`💾 Authentication state saved to ${authFile}`);
//   } catch (err) {
//     console.error('❌ Authentication setup failed:', err.message);
//     await page.screenshot({ path: 'test-results/auth-failure.png', fullPage: true });
//     throw err;
//   }
// });
// tests/auth.setup.js
import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  console.log('🚀 Starting authentication setup...');

  try {
    // Explicit URL (not relying on baseURL)
    await page.goto('https://ocr.techsavanna.technology/login', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    console.log('🌐 Login page loaded successfully.');

    // === Step 1: Fill credentials ===
    await page.fill('input[placeholder="Enter your email or username"]', 'reviewer1');
    await page.fill('input[placeholder="Enter your password"]', 'password123');
    console.log('📝 Credentials entered.');

    // === Step 2: Click Sign In ===
    const signInButton = page.locator("//button[normalize-space()='Sign in']");
    await signInButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('👀 Sign in button located, clicking...');

    // ✅ Avoid waiting for navigation — use Promise.race to avoid hanging
    await Promise.race([
      signInButton.click(),
      page.waitForTimeout(3000), // give it time to process AJAX calls
    ]);
    console.log('🔐 Clicked Sign in. Waiting for dashboard...');

    // === Step 3: Detect successful login ===
    // Try multiple selectors since the UI might differ slightly
    const possibleSelectors = [
      'text=Documents',
      'text=Dashboard',
      'text=Welcome',
    ];

    let dashboardDetected = false;
    for (const selector of possibleSelectors) {
      try {
        console.log(`⏳ Waiting... dashboard not found yet with ${selector}`);
        await page.waitForSelector(selector, { timeout: 10000 });
        console.log(`✅ Dashboard detected via selector: ${selector}`);
        dashboardDetected = true;
        break;
      } catch {
        continue; // move to the next possible selector
      }
    }

    if (!dashboardDetected) {
      throw new Error('Dashboard not detected after login — login may have failed.');
    }

    // === Step 4: Save authentication state ===
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
    await page.context().storageState({ path: authFile });

    console.log(`💾 Authentication state saved to ${authFile}`);
  } catch (err) {
    console.error('❌ Authentication setup failed:', err.message);

    // Ensure folder exists before saving screenshot
    if (!fs.existsSync('test-results')) fs.mkdirSync('test-results', { recursive: true });
    await page.screenshot({
      path: 'test-results/auth-failure.png',
      fullPage: true,
    });
    console.log('📸 Screenshot saved at test-results/auth-failure.png');

    throw err;
  }
});
