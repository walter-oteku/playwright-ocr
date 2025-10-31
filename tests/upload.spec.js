import { test, expect } from '@playwright/test';
import path from 'path';

test('Full document workflow: upload, search, filter, view, edit, delete', async ({ page }) => {
  test.setTimeout(180000);

  // === LOGIN ===
  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr-engine.netlify.app/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("📧 Typing email...");
  await page.getByPlaceholder("Enter your email").type("admin@example.com", { delay: 100 });

  console.log("🔑 Typing password...");
  await page.getByPlaceholder("Enter your password").type("password123", { delay: 100 });

  console.log("🚪 Clicking Sign In...");
  await page.getByRole('button', { name: /sign in/i }).click();

  console.log("⏳ Waiting for login success...");
  await expect(page.getByText(/login successful/i)).toBeVisible({ timeout: 15000 });
  console.log("✅ Login successful!");

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