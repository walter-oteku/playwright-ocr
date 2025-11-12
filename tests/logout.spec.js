// tests/logout.spec.js
import { test, expect } from '@playwright/test';
import { credentials } from './credentials.js';
import { LoginPage } from './pages.js';
import { logStep, waitForPageLoad, waitForVisible } from './utils.js';

test('🔐 Full login and logout flow with visible typing', async ({ page }) => {
  const testName = "Logout Flow Test";
  const { username, password } = credentials.reviewer;
  const loginPage = new LoginPage(page);

  // === STEP 1: LOGIN FLOW ===
  await logStep("🌐 Navigating to OCR Login Page...", testName);
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  await logStep("📧 Typing email...", testName);
  await loginPage.username.waitFor({ state: "visible", timeout: 10000 });
  await loginPage.username.fill('');
  await loginPage.username.type(username, { delay: 150 });

  await logStep("🔒 Typing password...", testName);
  await loginPage.password.waitFor({ state: "visible", timeout: 10000 });
  await loginPage.password.fill('');
  await loginPage.password.type(password, { delay: 150 });

  await logStep("🧩 Clicking Sign In button...", testName);
  await loginPage.signInBtn.click();

  await logStep("⏳ Waiting for Dashboard to load...", testName);
  await waitForPageLoad(page, 'Dashboard', testName);
  await waitForVisible(page.locator('text=Dashboard'), 15000, testName);

  await logStep("✅ Login successful! Dashboard loaded.", testName);

  // === STEP 2: LOGOUT FLOW ===
  await logStep("👤 Opening profile dropdown...", testName);
  const profileIcon = page.locator("(//*[name()='path'])[3]");
  await expect(profileIcon).toBeVisible({ timeout: 10000 });
  await profileIcon.click();

  await logStep("🚪 Clicking 'Sign out'...", testName);
  const logoutBtn = page.locator("(//li[@role='menuitem'])[1]");
  await expect(logoutBtn).toBeVisible({ timeout: 10000 });
  await logoutBtn.click();

  await logStep("⏳ Waiting for login page to reappear...", testName);
  await waitForVisible(page.locator('text=Sign in'), 15000, testName);

  await logStep("✅ Successfully logged out! 🎉", testName);
});
