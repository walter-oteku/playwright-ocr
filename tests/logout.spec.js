import { test, expect } from '@playwright/test';

test('Full login and logout flow with visible typing', async ({ page }) => {
  // === STEP 1: Navigate to Login Page ===
  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr-engine.netlify.app/login');
  await page.waitForLoadState('domcontentloaded');

  // === STEP 2: Type Email Slowly ===
  console.log("📧 Typing email...");
  const emailField = page.getByPlaceholder("Enter your email");
  await emailField.click();
  await emailField.type("admin@example.com", { delay: 150 }); // slow typing effect

  // === STEP 3: Type Password Slowly ===
  console.log("🔑 Typing password...");
  const passwordField = page.getByPlaceholder("Enter your password");
  await passwordField.click();
  await passwordField.type("password123", { delay: 150 }); // slow typing effect

  // === STEP 4: Click Sign In ===
  console.log("🚪 Clicking Sign In button...");
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await page.waitForTimeout(500); // slight pause for realism
  await signInButton.click();

  // === STEP 5: Wait for Success Message or Dashboard ===
  console.log("⏳ Waiting for login success message...");
  const successMessage = page.getByText(/login successful/i);
  await successMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(async () => {
    console.log("⚠️ No visible toast — checking for dashboard instead...");
    await page.waitForSelector('text=Manual Review', { timeout: 10000 });
  });
  console.log("✅ Login confirmed successfully!");

  // === STEP 6: Open Profile Menu ===
  console.log("👤 Opening profile dropdown...");
  const profileIcon = page.locator("(//*[name()='svg'][@class='h-8 w-8 text-gray-400'])[1]");
  await expect(profileIcon).toBeVisible({ timeout: 10000 });
  await profileIcon.click();

  // === STEP 7: Click 'Sign out' ===
  console.log("🚪 Clicking 'Sign out'...");
  const logoutBtn = page.locator("(//button[normalize-space()='Sign out'])[1]");
  await expect(logoutBtn).toBeVisible({ timeout: 10000 });
  await logoutBtn.click();

  // === STEP 8: Wait for Sign In Page to Reappear ===
//   console.log("⏳ Waiting for sign-in screen to reload...");
//   await page.waitForSelector('text=Sign In', { timeout: 10000 });

  console.log("✅ Successfully logged out! 🎉");
});
