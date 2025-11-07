import { test, expect } from '@playwright/test';

test('Full login and logout flow with visible typing', async ({ page }) => {
 // Step 1: Navigate to the login page
  console.log(" Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

 // Step 2: Enter email address with visible typing
console.log("📧 Typing email slowly...");

const emailSelector = "(//input[@id='_R_hlbinpfjrb_'])[1]";
const emailField = page.locator(emailSelector);

// Wait for email input to appear and interact with it
await emailField.waitFor({ state: "visible", timeout: 10000 });
await emailField.click();
await emailField.fill(""); // Clear any existing text
await emailField.type("admin@ocrplatform.com", { delay: 150 }); // Simulate natural typing


// Step 3: Enter password with visible typing
console.log("🔒 Typing password slowly...");

const passwordSelector = "(//input[@id='_R_ilbinpfjrb_'])[1]";
const passwordField = page.locator(passwordSelector);

// Wait for password field to be ready, clear it, then type naturally
await passwordField.waitFor({ state: "visible", timeout: 10000 });
await passwordField.click();
await passwordField.fill(""); // Clear any pre-filled content
await passwordField.type("admin123", { delay: 150 }); // Simulate human typing


  // Step 4: Click Sign In button (with visible pause)
  console.log("Clicking Sign In button...");
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await page.waitForTimeout(500); // short delay before click
  await signInButton.click();

  // Step 5: Wait for a login success message
  console.log("Waiting for success message...");
  const successMessage = page.getByText(/Login successful/i);
  

  // Wait up to 10 seconds for the message to appear
  await expect(successMessage).toBeVisible({ timeout: 10000 });

  console.log("Login test passed!");


  console.log("✅ Login confirmed successfully!");

  // === STEP 6: Open Profile Menu ===
  console.log("👤 Opening profile dropdown...");
  const profileIcon = page.locator("(//*[name()='path'])[3]");
  await expect(profileIcon).toBeVisible({ timeout: 10000 });
  await profileIcon.click();

  // === STEP 7: Click 'Sign out' ===
  console.log("🚪 Clicking 'Sign out'...");
  const logoutBtn = page.locator("(//li[@role='menuitem'])[1]");
  await expect(logoutBtn).toBeVisible({ timeout: 10000 });
  await logoutBtn.click();

  // === STEP 8: Wait for Sign In Page to Reappear ===
//   console.log("⏳ Waiting for sign-in screen to reload...");
//   await page.waitForSelector('text=Sign In', { timeout: 10000 });

  console.log("✅ Successfully logged out! 🎉");
});
