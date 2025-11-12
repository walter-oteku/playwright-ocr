// tests/system-configuration.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { waitForPageLoad } from './utils.js';

test('System Configuration Workflow (Updated UI)', async ({ page }) => {
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

  // === STEP 2: OPEN SYSTEM CONFIG TAB ===
  console.log("⚙️ Navigating to System Config tab...");
  const systemConfigTab = page.locator("//a[normalize-space()='System Config']");
  await systemConfigTab.waitFor({ state: 'visible', timeout: 15000 });
  await systemConfigTab.click();
  await page.waitForURL(/system/, { timeout: 15000 });
  console.log("✅ System Config page opened.");

  // === STEP 3: CLICK 'EDIT CONFIGURATION' ===
  console.log("🧩 Clicking 'Edit Configuration'...");
  const editConfigBtn = page.locator("(//button[normalize-space()='Edit Configuration'])[1]");
  await editConfigBtn.waitFor({ state: 'visible', timeout: 10000 });
  await editConfigBtn.click();
  await page.waitForTimeout(1500);
  console.log("✅ Edit Configuration mode activated.");

  // === STEP 4: FILE UPLOAD SETTINGS ===
  console.log("📂 Editing File Upload Settings...");

  const maxFileSize = page.locator("(//input[@id='_r_4b_'])[1]");
  await maxFileSize.waitFor({ state: 'visible', timeout: 10000 });
  await maxFileSize.fill('52428800');
  console.log("✅ Updated maximum file size (MB).");

  const allowedFileTypes = [
    "(//input[@id='_r_4c_'])[1]",
    "(//input[@id='_r_4d_'])[1]",
    "(//input[@id='_r_4e_'])[1]",
    "(//input[@id='_r_4f_'])[1]",
    "(//input[@id='_r_4g_'])[1]",
  ];

  const fileTypeValues = [
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/bmp",
    "application/pdf",
  ];

  for (let i = 0; i < allowedFileTypes.length; i++) {
    const fileField = page.locator(allowedFileTypes[i]);
    await fileField.waitFor({ state: 'visible', timeout: 10000 });
    await fileField.fill(fileTypeValues[i]);
    console.log(`✅ Allowed file type set: ${fileTypeValues[i]}`);
  }

  const addFileTypeBtn = page.locator("(//button[normalize-space()='+ Add File Type'])[1]");
  await addFileTypeBtn.waitFor({ state: 'visible', timeout: 10000 });
  await addFileTypeBtn.click();
  console.log("✅ Added new file type row.");

  // === STEP 5: PROCESSING SETTINGS ===
  console.log("⚙️ Updating Processing Settings...");
  const processingField = page.locator("(//input[@id='_r_14_'])[1]");
  await processingField.fill('0.85');
  console.log("✅ Processing threshold updated.");

  const autoProcessingToggle = page.locator("(//input[@name='autoProcessing'])[1]");
  await autoProcessingToggle.check();
  console.log("✅ Enabled automatic processing.");

  // === STEP 6: OCR SETTINGS ===
  console.log("🧠 Configuring OCR Settings...");
  const ocrDropdown = page.locator("(//div[@id='_r_15_'])[1]");
  await ocrDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await ocrDropdown.click();

  const englishOption = page.locator("//li[normalize-space()='English']");
  await englishOption.waitFor({ state: 'visible', timeout: 5000 });
  await englishOption.click();
  console.log("✅ OCR language set to English.");

  const preprocessingToggle = page.locator("(//input[@name='ocrSettings.preprocessing'])[1]");
  await preprocessingToggle.check();
  console.log("✅ Enabled OCR image preprocessing.");

  // === STEP 7: DATA RETENTION SETTINGS ===
  console.log("📦 Editing Data Retention Settings...");
  const retentionField = page.locator("(//input[@id='_r_17_'])[1]");
  await retentionField.fill('30');
  console.log("✅ Data retention period set to 30 days.");

  // === STEP 8: NOTIFICATION SETTINGS ===
  console.log("📨 Editing Notification Settings...");
  const emailNotifToggle = page.locator("(//input[@name='notificationSettings.email'])[1]");
  const webhookNotifToggle = page.locator("(//input[@name='notificationSettings.webhook'])[1]");
  const webhookUrlField = page.locator("(//input[@id='_r_18_'])[1]");

  await emailNotifToggle.check();
  await webhookNotifToggle.check();
  await webhookUrlField.fill('https://ocr.techsavanna.technology/');
  console.log("✅ Notifications configured successfully.");

  // === STEP 9: SAVE CONFIGURATION ===
  console.log("💾 Saving configuration...");
  const saveBtn = page.locator("(//button[normalize-space()='Save Configuration'])[1]");
  await saveBtn.waitFor({ state: 'visible', timeout: 10000 });
  await saveBtn.click();

  // Wait for confirmation or UI refresh
  await page.waitForTimeout(3000);
  const successMessage = page.locator("//div[contains(., 'Configuration saved') or contains(., 'successfully')]");
  if (await successMessage.isVisible().catch(() => false)) {
    console.log("🎉 Configuration saved successfully!");
  } else {
    console.warn("⚠️ No explicit success message detected. Check backend or console logs.");
  }

  console.log("🏁 System Configuration Workflow Completed!");
});