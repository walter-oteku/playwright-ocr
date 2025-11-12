import { test, expect } from '@playwright/test';
import testData from './testData.json' assert { type: 'json' };
import { logStep, waitForVisible } from './utils.js'; // centralized utils

test('Invalid Login - Using incorrect email and password', async ({ page }) => {
  test.setTimeout(60000);
  const { invalidUser } = testData;

  // === STEP 1: NAVIGATE TO LOGIN PAGE ===
  await logStep(page, "🌐 Navigating to OCR Login Page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');
  await waitForVisible(page, "(//input[@id='_R_hlbinpfjrb_'])[1]");
  await logStep(page, "✅ Login Page loaded successfully.");

  // === STEP 2: ENTER INVALID CREDENTIALS ===
  const emailField = page.locator("(//input[@id='_R_hlbinpfjrb_'])[1]");
  const passwordField = page.locator("(//input[@id='_R_ilbinpfjrb_'])[1]");
  const signInButton = page.getByRole('button', { name: /sign in/i });

  await logStep(page, "📧 Typing invalid email...");
  await emailField.fill('');
  await emailField.type(invalidUser.email, { delay: 120 });

  await logStep(page, "🔒 Typing invalid password...");
  await passwordField.fill('');
  await passwordField.type(invalidUser.password, { delay: 120 });

  // === STEP 3: ATTEMPT LOGIN ===
  await logStep(page, "🚪 Clicking 'Sign In' button...");
  await signInButton.click();

  // === STEP 4: VERIFY ERROR MESSAGE ===
  const errorText = /Invalid email or password/i;
  await logStep(page, "⏳ Waiting for invalid credentials error...");
  await waitForVisible(page, errorText);
  await expect(page.getByText(errorText)).toBeVisible();
  await logStep(page, "❌ Correct error message displayed for invalid credentials.");

  console.log("🎯 Invalid login test completed successfully!");
});
