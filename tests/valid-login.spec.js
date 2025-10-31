
import { test, expect } from '@playwright/test';

test('Verify valid login with visible typing and success message', async ({ page }) => {
  // Step 1: Navigate to the login page
  console.log(" Navigating to login page...");
  await page.goto('https://ocr-engine.netlify.app/login');
  await page.waitForLoadState('domcontentloaded');

  // Step 2: Type email slowly
  console.log("Typing email...");
  const emailField = page.getByPlaceholder("Enter your email");
  await emailField.click();
  await emailField.type("admin@example.com", { delay: 150 }); // slow typing

  // Step 3: Type password slowly
  console.log("Typing password...");
  const passwordField = page.getByPlaceholder("Enter your password");
  await passwordField.click();
  await passwordField.type("password123", { delay: 150 }); // slow typing

  // Step 4: Click Sign In button (with visible pause)
  console.log("Clicking Sign In button...");
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await page.waitForTimeout(500); // short delay before click
  await signInButton.click();

  // Step 5: Wait for a login success message
  console.log("Waiting for success message...");
  const successMessage = page.getByText(/login successful/i);

  // Wait up to 10 seconds for the message to appear
  await expect(successMessage).toBeVisible({ timeout: 10000 });

  console.log("Login test passed!");
});
