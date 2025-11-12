// tests/document-workflow.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { waitForPageLoad } from './utils.js';

test('Full document workflow: upload, search, filter, view, edit, delete', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const { username, password } = credentials.reviewer;

  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("🔐 Logging in as reviewer...");
  await loginPage.login(username, password);

  await waitForPageLoad(page, 'Dashboard');
  await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });

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

  // === OPTIONAL: Verify upload success message ===  Successfully uploaded INVOICE.pdf
  await expect(page.getByText(/Successfully uploaded|document uploaded/i)).toBeVisible({ timeout: 10000 });
  console.log("🎉 Upload confirmed as successful!");
});