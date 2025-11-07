import { test, expect } from '@playwright/test';

test('Audit Logs: Export CSV and view details flow', async ({ page }) => {
  test.setTimeout(180000);

  // === STEP 1: LOGIN ===
  console.log("🚀 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  // Enter username
  console.log("👤 Entering username...");
  const emailField = page.locator("(//input[@id='_R_hlbinpfjrb_'])[1]");
  await emailField.waitFor({ state: 'visible', timeout: 10000 });
  await emailField.fill("reviewer1");

  // Enter password
  console.log("🔒 Entering password...");
  const passwordField = page.locator("(//input[@id='_R_ilbinpfjrb_'])[1]");
  await passwordField.waitFor({ state: 'visible', timeout: 10000 });
  await passwordField.fill("password123");

  // Click Sign In
  console.log("🔓 Clicking 'Sign In'...");
  const signInButton = page.locator("//button[normalize-space()='Sign in']");
  await signInButton.waitFor({ state: 'visible', timeout: 10000 });
  await signInButton.click();

  // Wait for dashboard to load
  console.log("🕒 Waiting for dashboard to load...");
  await page.waitForSelector("text=Dashboard", { timeout: 20000 });
  console.log("✅ Login successful!");

  // === STEP 2: NAVIGATE TO AUDIT LOGS ===
  console.log("📋 Navigating to 'Audit Logs'...");
  const auditLogsTab = page.locator("(//a[normalize-space()='Audit Logs'])[1]");
  await auditLogsTab.waitFor({ state: 'visible', timeout: 15000 });
  await auditLogsTab.click();

  await page.waitForURL(/audit/, { timeout: 15000 });
  console.log("✅ Audit Logs page loaded.");

  // === STEP 3: EXPORT AUDIT LOGS TO CSV ===
  console.log("📦 Opening export format dropdown...");
  const exportDropdown = page.locator("(//div[@id='export-format'])[1]");
  await exportDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await exportDropdown.click();
  await page.waitForTimeout(1000);

  console.log("🧾 Selecting CSV format...");
  const csvOption = page.locator("//li[normalize-space()='CSV']");
  await csvOption.waitFor({ state: 'visible', timeout: 10000 });
  await csvOption.click();
  console.log("✅ CSV format selected.");

  console.log("📤 Clicking 'Export Audit Logs' button...");
  const exportButton = page.locator("(//button[normalize-space()='Export Audit Logs'])[1]");
  await exportButton.waitFor({ state: 'visible', timeout: 10000 });
  await exportButton.click();
  console.log("✅ Export initiated — CSV download should begin shortly.");

  await page.waitForTimeout(3000); // small grace period for download to start

  // === STEP 4: VIEW A SPECIFIC AUDIT LOG ===
  console.log("🔍 Scrolling to audit log entries...");
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1500);

  console.log("👁️ Clicking 'View details' icon for a log entry...");
  const viewButton = page.locator("(//button[@aria-label='View details'])[6]");
  await viewButton.waitFor({ state: 'visible', timeout: 10000 });
  await viewButton.click();

  console.log("🪟 Viewing audit log details...");
  await page.waitForSelector("//button[normalize-space()='Close']", { timeout: 15000 });
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1500);

  // === STEP 5: CLOSE DETAILS MODAL ===
  console.log("❌ Closing the details view...");
  const closeButton = page.locator("(//button[normalize-space()='Close'])[1]");
  await closeButton.waitFor({ state: 'visible', timeout: 10000 });
  await closeButton.click();

  console.log("✅ Audit log details closed successfully.");

  // === STEP 6: DONE ===
  await page.waitForTimeout(1500);
  console.log("🎉 Full export and view flow completed successfully!");
});
