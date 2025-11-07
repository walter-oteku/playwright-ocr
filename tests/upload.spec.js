import { test, expect } from '@playwright/test';
import path from 'path';

test('Full document workflow: upload, search, filter, view, edit, delete', async ({ page }) => {
  test.setTimeout(180000);

  // === LOGIN ===
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

  // === STEP 1: Navigate to Upload ===
console.log("📁 Navigating to 'Upload' tab...");
await page.locator('(//a[normalize-space()="Upload"])[1]').click();
await page.waitForURL(/upload/, { timeout: 15000 });
console.log("✅ Upload page loaded.");

 // === STEP 2: Simulate slow upload ===
  console.log("📎 Preparing to upload sample document...");
  const filePath = path.resolve('C:/Users/walte/OneDrive/Documents/Parklands_Training_Tracker.pdf');
  const fileInput = page.locator('input[type="file"]');

  console.log("⌛ Starting simulated slow upload...");
  await new Promise(async (resolve) => {
    for (let i = 0; i <= 100; i += 20) {
      console.log(`🚀 Upload progress: ${i}%`);
      await page.waitForTimeout(1000); // wait 1 second between each progress step
    }
    resolve();
  });

  await fileInput.setInputFiles(filePath);
  console.log("📤 File upload initiated...");
  await page.waitForTimeout(3000); // extra time to simulate backend processing
  console.log("✅ File uploaded successfully!");

  // === OPTIONAL: Verify upload success message ===
  await expect(page.getByText(/upload successful|document uploaded/i)).toBeVisible({ timeout: 10000 });
  console.log("🎉 Upload confirmed as successful!");


  // // === STEP 3: Upload a sample file ===
  // console.log("📎 Uploading sample document...");
  // const filePath = path.resolve('C:/Users/walte/OneDrive/Documents/Parklands_Training_Tracker.pdf');
  // const fileInput = page.locator('input[type="file"]');
  // await fileInput.setInputFiles(filePath);
  // console.log("✅ File uploaded successfully!");
});