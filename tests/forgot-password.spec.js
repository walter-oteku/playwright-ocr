import { test, expect } from '@playwright/test';
import { logStep, waitForVisible } from './utils.js'; // centralized logs & waits

test('Forgot Password Flow - Invalid and Valid Email', async ({ page }) => {
  test.setTimeout(120000);

  // === STEP 1: LOGIN PAGE ===
  await logStep(page, "🌐 Navigating to OCR Login Page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await waitForVisible(page, "(//a[normalize-space()='Forgot your password?'])[1]");
  await logStep(page, "✅ Login Page loaded.");

  // === STEP 2: CLICK FORGOT PASSWORD ===
  const forgotPasswordLink = "(//a[normalize-space()='Forgot your password?'])[1]";
  await logStep(page, "🧩 Clicking 'Forgot your password?' link...");
  await page.locator(forgotPasswordLink).click();

  // === STEP 3: VERIFY PAGE ELEMENTS ===
  const emailField = "(//input[@id='_R_2j7ainpfjrb_'])[1]";
  const sendResetButton = "(//button[normalize-space()='Send Reset Link'])[1]";
  const signInLink = "(//a[normalize-space()='Sign in'])[1]";
  await waitForVisible(page, emailField);
  await logStep(page, "✅ Forgot Password page ready.");

  // === TEST CASE 1: INVALID EMAIL ===
  await logStep(page, "📧 Testing with INVALID email...");
  await page.fill(emailField, "walter@gmail.com");
  await page.locator(sendResetButton).click();

  const invalidMsg = "Forgot password failed: No account found with that email";
  await waitForVisible(page, `text=${invalidMsg}`);
  await expect(page.getByText(invalidMsg)).toBeVisible();
  await logStep(page, "🚫 Error message displayed correctly for invalid email.");

  // === TEST CASE 2: VALID EMAIL ===
  await logStep(page, "📧 Testing with VALID email...");
  await page.fill(emailField, "annotator1@ocrplatform.com");
  await page.locator(sendResetButton).click();

  const successMsg = /Password reset link sent to your email/i;
  await waitForVisible(page, successMsg);
  await expect(page.getByText(successMsg)).toBeVisible();
  await logStep(page, "📩 Reset link sent successfully for valid email.");

  // === STEP 4: RETURN TO SIGN-IN ===
  await logStep(page, "↩️ Returning to Sign-In page...");
  await page.locator(signInLink).click();

  await waitForVisible(page, "text=Welcome back");
  await expect(page.getByText("Welcome back")).toBeVisible();
  await logStep(page, "✅ Back on Sign-In page. Flow complete!");

  console.log("🎯 Forgot Password test completed successfully!");
});
