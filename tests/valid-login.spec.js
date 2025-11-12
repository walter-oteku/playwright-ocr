// tests/valid-login.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { waitForPageLoad } from './utils.js';

test('✅ Verify valid login using reviewer credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const { username, password } = credentials.reviewer;

  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("🔐 Logging in as reviewer...");
  await loginPage.login(username, password);

  await waitForPageLoad(page, 'Dashboard');
  await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });

  console.log("✅ Login successful!");
});
