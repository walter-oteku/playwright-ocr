// tests/auth.setup.js
import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { credentials } from './credentials.js';

// 🔐 Define path where authenticated session will be stored
const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

setup('🔑 Authenticate user and save session', async ({ page }) => {
  console.log('🚀 Starting authentication setup...');

  // Choose which user to log in as — update as needed
  const { username, password } = credentials.annotator || {
    username: 'annotator1',
    password: 'password123',
  };

  try {
    // === STEP 1: Navigate to Login Page ===
    console.log('🌍 Navigating to login page...');
    await page.goto('https://ocr.techsavanna.technology/login', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // === STEP 2: Fill in Credentials ===
    console.log(`👤 Logging in as: ${username}`);
    await page.fill('input[placeholder="Enter your email or username"]', username);
    await page.fill('input[placeholder="Enter your password"]', password);

    // === STEP 3: Click Sign In ===
    const signInButton = page.locator("//button[normalize-space()='Sign in']");
    await signInButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('👉 Clicking "Sign in" button...');
    await Promise.race([
      signInButton.click(),
      page.waitForTimeout(2000),
    ]);

    // === STEP 4: Wait for Successful Login ===
    console.log('⏳ Waiting for dashboard or home indicators...');
    const possibleSelectors = [
      'text=Dashboard',
      'text=Documents',
      'text=Welcome',
      'text=Projects',
    ];

    let success = false;
    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        console.log(`✅ Login confirmed via selector: ${selector}`);
        success = true;
        break;
      } catch {
        continue;
      }
    }

    if (!success) {
      throw new Error('❌ Login failed: Dashboard not detected.');
    }

    // === STEP 5: Save Authenticated Session ===
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });
    await page.context().storageState({ path: authFile });

    console.log(`💾 Authentication state saved successfully at: ${authFile}`);

  } catch (err) {
    console.error(`🚨 Authentication setup failed: ${err.message}`);

    // Capture screenshot for debugging
    const failDir = path.resolve('test-results');
    if (!fs.existsSync(failDir)) fs.mkdirSync(failDir, { recursive: true });
    const screenshotPath = path.join(failDir, 'auth-failure.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`📸 Screenshot saved at: ${screenshotPath}`);
    throw err;
  }
});
