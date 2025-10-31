import { test, expect } from '@playwright/test';

test('Verify valid login with password toggle, checkbox, and visible typing', async ({ page }) => {
  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr-engine.netlify.app/login');
  await page.waitForLoadState('domcontentloaded');

  // Step 1: Type email slowly
  console.log("📧 Typing email...");
  const emailField = page.getByPlaceholder("Enter your email");
  await emailField.click();
  await emailField.type("admin@example.com", { delay: 150 });

  // Step 2: Toggle eye icon BEFORE typing password
console.log("👁️ Toggling password visibility before typing...");
const eyeIconButton = page.locator("//button[@type='button']");
await page.waitForTimeout(700);
await eyeIconButton.click({ force: true });

  // Step 2: Type password slowly
  console.log("🔑 Typing password...");
  const passwordField = page.getByPlaceholder("Enter your password");
  await passwordField.click();
  await passwordField.type("password123", { delay: 150 });

  // Step 4: Check and uncheck the 'Remember me' checkbox
  console.log("✅ Checking 'Remember me'...");
  const rememberMeCheckbox = page.getByRole('checkbox', { name: /Remember me/i });
  await page.waitForTimeout(800);
  await rememberMeCheckbox.check();
  await page.waitForTimeout(800);
  await rememberMeCheckbox.uncheck();

  // Step 5: Click Sign In button (with visible pause)
  console.log("🚪 Clicking Sign In button...");
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await page.waitForTimeout(800);
  await signInButton.click();

  // Step 6: Wait for a login success message
  console.log("⏳ Waiting for success message...");
  const successMessage = page.getByText(/login successful/i);
  await expect(successMessage).toBeVisible({ timeout: 10000 });

  console.log("✅ Login test passed!");
});
