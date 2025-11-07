import { test, expect } from '@playwright/test';

test('Forgot Password Flow - Invalid and Valid Email', async ({ page }) => {
  test.setTimeout(120000);

  // === STEP 1: Go to Login Page ===
  await page.goto('https://ocr.techsavanna.technology/login');
  console.log("Navigated to OCR Login Page ✅");

  // === STEP 2: Click 'Forgot your password?' link ===
  const forgotPasswordLink = "(//a[normalize-space()='Forgot your password?'])[1]";
  await page.locator(forgotPasswordLink).click();
  console.log("Clicked on Forgot Password link 🔗");

  // === STEP 3: On Forgot Password page ===
  const emailField = "(//input[@id='_R_2j7ainpfjrb_'])[1]";
  const sendResetButton = "(//button[normalize-space()='Send Reset Link'])[1]";
  const signInLink = "(//a[normalize-space()='Sign in'])[1]";

  // === TEST CASE 1: Invalid Email ===
  await page.fill(emailField, "walter@gmail.com");
  await page.locator(sendResetButton).click();
  console.log("Testing invalid email submission... ❌");

  // Expect error message for invalid email
  await expect(page.getByText("Forgot password failed: No account found with that email"))
    .toBeVisible({ timeout: 10000 });
  console.log("Error message correctly displayed for invalid email 🚫");

  // === TEST CASE 2: Valid Email ===
  await page.fill(emailField, "annotator1@ocrplatform.com");
  await page.locator(sendResetButton).click();
  console.log("Testing valid email submission... ✅");

  // Expect success message or confirmation
  await expect(page.getByText(/Password reset link sent to your email/i))
    .toBeVisible({ timeout: 10000 });
  console.log("Reset link successfully sent to valid email 📩");

  // === OPTIONAL: Navigate back to Sign In page ===
  await page.locator(signInLink).click();
  await expect(page.getByText("Welcome back")).toBeVisible();
  console.log("Returned to Sign In page 🏠");
});
