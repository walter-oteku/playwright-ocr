// tests/audit-logs.spec.js
import { test, expect } from '@playwright/test';
import { credentials } from './credentials.js';
import { LoginPage } from './pages.js';
import { waitForPageLoad } from './utils.js';

test('🧾 Audit Logs: Export CSV and view details flow', async ({ page }) => {
  const { username, password } = credentials.reviewer;
  const loginPage = new LoginPage(page);

  // === STEP 1: LOGIN FLOW ===
  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("🔐 Logging in as reviewer...");
  await loginPage.login(username, password);

  await waitForPageLoad(page, 'Dashboard');
  await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  console.log("✅ Login successful! Dashboard loaded.");

  // === STEP 2: NAVIGATE TO AUDIT LOGS ===
  console.log("📋 Navigating to 'Audit Logs'...");
  const auditLogsSelectors = [
    "text=Audit Logs",
    "//a[normalize-space()='Audit Logs']",
    "//span[normalize-space()='Audit Logs']"
  ];

  let navigated = false;
  for (const selector of auditLogsSelectors) {
    const tab = page.locator(selector).first();
    if (await tab.isVisible()) {
      await tab.click({ timeout: 5000 });
      navigated = true;
      console.log(`✅ Clicked Audit Logs tab using selector: ${selector}`);
      break;
    }
  }

  if (!navigated) throw new Error("❌ Audit Logs tab not found or clickable!");

  await page.waitForURL(/audit/, { timeout: 15000 });
  console.log("✅ Audit Logs page loaded successfully.");
  await page.waitForTimeout(1500);

  // === STEP 3: EXPORT AUDIT LOGS TO CSV ===
  console.log("📦 Opening export format dropdown...");
  const exportDropdown = page.locator("(//div[@id='export-format'])[1]");
  await exportDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await exportDropdown.click();

  console.log("🧾 Selecting CSV format...");
  const csvOption = page.locator("//li[normalize-space()='CSV']");
  await csvOption.waitFor({ state: 'visible', timeout: 5000 });
  await csvOption.click();
  console.log("✅ CSV format selected.");

  console.log("📤 Clicking 'Export Audit Logs' button...");
  const exportButton = page.locator("(//button[normalize-space()='Export Audit Logs'])[1]");
  await exportButton.waitFor({ state: 'visible', timeout: 5000 });
  await exportButton.click();
  console.log("✅ Export initiated — CSV download should begin shortly.");

  await page.waitForTimeout(3000); // brief delay for file download

  // === STEP 4: VIEW A SPECIFIC AUDIT LOG ENTRY ===
  console.log("🔍 Scrolling to audit log entries...");
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1500);

  console.log("👁️ Opening 'View details' for a specific log entry...");
  const viewButton = page.locator("(//button[@aria-label='View details'])[6]");
  await viewButton.waitFor({ state: 'visible', timeout: 10000 });
  await viewButton.click();
  console.log("🪟 Audit log details modal opened.");

  await page.waitForSelector("//button[normalize-space()='Close']", { timeout: 10000 });
  await page.waitForTimeout(1500);

  // === STEP 5: CLOSE DETAILS MODAL ===
  console.log("❌ Closing details modal...");
  const closeButton = page.locator("(//button[normalize-space()='Close'])[1]");
  await closeButton.waitFor({ state: 'visible', timeout: 10000 });
  await closeButton.click();
  console.log("✅ Audit log details closed successfully.");

  // === STEP 6: WRAP-UP ===
  await page.waitForTimeout(1500);
  console.log("🎉 Full export and view flow completed successfully!");
});
