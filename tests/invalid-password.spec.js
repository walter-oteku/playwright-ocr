import { test, expect } from '@playwright/test';
import testData from './testData.json' assert { type: 'json' };
import { LoginPage } from './pages.js';
import { logStep, waitForVisible } from './utils.js';

test('Verify login fails with invalid password', async ({ page }) => {
  const { validUser } = testData;
  const loginPage = new LoginPage(page);

  // Determine login value dynamically
  const loginValue = validUser.email || validUser.username;
  if (!loginValue) {
    throw new Error("❌ validUser.email or validUser.username is missing in testData.json");
  }

  // === Navigate to login page ===
  await logStep(page, "🌐 Navigating to OCR Login Page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');
  await logStep(page, "✅ Login page loaded successfully.");

  // === Enter correct login value ===
  await logStep(page, `📧 Typing login: ${loginValue}`);
  await loginPage.username.waitFor({ state: "visible", timeout: 10000 });
  await loginPage.username.fill('');
  await loginPage.username.type(loginValue, { delay: 150 });

  // === Enter incorrect password ===
  await logStep(page, "🔒 Typing WRONG password...");
  await loginPage.password.waitFor({ state: "visible", timeout: 10000 });
  await loginPage.password.fill('');
  await loginPage.password.type("password3", { delay: 150 }); // intentionally wrong

  // === Click Sign In button ===
  await logStep(page, "🧩 Clicking Sign In button...");
  await loginPage.signInBtn.click();

  // === Verify error message is visible ===
  await logStep(page, "🕵️ Waiting for error message...");
  await waitForVisible(page, 'Invalid email or password', 15000);
  await logStep(page, "✅ Error message displayed as expected.");

  // === Verify user remains on login page (did not log in) ===
  await logStep(page, "🔒 Checking user is still on login page...");
  await expect(page).toHaveURL(/login/);
  await logStep(page, "✅ User did not log in with invalid password.");
});
