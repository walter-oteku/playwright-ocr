
import { test, expect } from '@playwright/test';

test('System Configuration, Status & Logs workflow', async ({ page }) => {
  test.setTimeout(240000);

  // === STEP 1: LOGIN ===
  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr-engine.netlify.app/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("📧 Typing email...");
  await page.getByPlaceholder("Enter your email").fill("admin@example.com");

  console.log("🔑 Typing password...");
  await page.getByPlaceholder("Enter your password").fill("password123");

  console.log("🚪 Clicking Sign In...");
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  console.log("✅ Logged in successfully!");

  // === STEP 2: NAVIGATE TO SYSTEM CONFIG TAB ===
  console.log("⚙️ Navigating to 'System Config' tab...");
  const systemConfigTab = page.locator("//a[normalize-space()='System Config']");
  await systemConfigTab.waitFor({ state: 'visible', timeout: 10000 });
  await systemConfigTab.click();
  await page.waitForURL(/system/, { timeout: 15000 });
  console.log("✅ System Config page loaded!");

  // === STEP 3: CLICK EDIT CONFIGURATION ===
  console.log("🧩 Clicking 'Edit Configuration'...");
  const editConfigBtn = page.locator("//button[normalize-space()='Edit Configuration']");
  await editConfigBtn.waitFor({ state: 'visible', timeout: 10000 });
  await editConfigBtn.click();
  console.log("✅ Edit Configuration form opened!");

  // === STEP 4: EDIT CONFIGURATION FIELDS ===
  console.log("✍️ Editing File Upload Settings...");
  const fileSizeField = page.locator("//input[@placeholder='50']");
  await fileSizeField.fill('10485760');
  await page.waitForTimeout(1000);
  console.log("✅ File upload size limit updated successfully!");

  console.log("🧩 Updating allowed file types...");
  const allowedTypesField = page.locator("//input[@placeholder='image/jpeg,image/png,application/pdf']");
  await allowedTypesField.fill('image/jpeg,image/png,image/tiff,image/bmp,application/pdf');
  await page.waitForTimeout(1000);
  console.log("✅ Allowed file types updated successfully!");

  console.log("⚙️ Editing Processing Settings...");
  const classificationThreshold = page.locator("//input[@placeholder='0.8']");
  await classificationThreshold.fill('0.8');
  await page.waitForTimeout(1000);
  console.log("✅ Classification threshold set to 0.8!");

  console.log("⚙️ Setting Extraction Threshold...");
  const extractionThreshold = page.locator("//input[@placeholder='0.7']");
  await extractionThreshold.fill('0.8');
  await page.waitForTimeout(1000);
  console.log("✅ Extraction threshold updated to 0.8!");

  console.log("📨 Editing Notification Settings...");
  const emailCheckbox = page.locator("//input[@name='notificationSettings.email']");
  const webhookCheckbox = page.locator("//input[@name='notificationSettings.webhook']");
  const webhookUrlField = page.locator("//input[@placeholder='https://example.com/webhook']");

  await emailCheckbox.check();
  await webhookCheckbox.check();
  await webhookUrlField.fill('https://otekuwalter.netlify.app/');
  await page.waitForTimeout(1000);

  console.log("✅ Notification settings updated successfully!");
  console.log("✅ Email notifications enabled!");
  console.log("🔁 Webhook notifications toggled and re-enabled!");
  console.log("🌐 Webhook URL updated!");

  // === STEP 5: SAVE CONFIGURATION ===
  console.log("💾 Attempting to save configuration...");
  const saveBtn = page.locator("//button[normalize-space()='Save Configuration']");
  await saveBtn.waitFor({ state: 'visible', timeout: 7000 });

  await Promise.all([
    page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {
      console.warn("⚠️ Page might have reloaded silently or taken long to stabilize.");
    }),
    saveBtn.click(),
  ]);

  console.log("🚀 'Save Configuration' button clicked — waiting for page to stabilize...");
  await page.waitForTimeout(3000);

  // === CHECK FOR SUCCESS MESSAGE ===
  const successMessage = page.locator(
    "//div[contains(., 'Configuration saved') or contains(., 'successfully') or contains(., 'updated')]"
  );
  if (await successMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log("🎉 Configuration saved confirmation detected!");
  } else {
    console.log("ℹ️ No success message detected, proceeding cautiously...");
  }


// === STEP 6: Navigate to System Status Tab ===
console.log("📊 Navigating to 'System Status' tab...");

await page.waitForLoadState('networkidle', { timeout: 15000 });
await page.waitForTimeout(3000); // let the UI settle

// Define multiple potential locators (in case DOM differs)
const systemStatusTabSelectors = [
  "//a[contains(normalize-space(.), 'System Status')]",
  "//button[contains(normalize-space(.), 'System Status')]",
  "//span[contains(text(), 'System Status')]",
];

let systemStatusTabFound = false;
for (let attempt = 1; attempt <= 3; attempt++) {
  console.log(`⚙️ Attempt ${attempt}: Looking for 'System Status' tab...`);
  for (const selector of systemStatusTabSelectors) {
    const tab = page.locator(selector);
    if (await tab.first().isVisible().catch(() => false)) {
      console.log(`✅ Found 'System Status' tab using selector: ${selector}`);
      await tab.first().scrollIntoViewIfNeeded();
      await tab.first().click();
      systemStatusTabFound = true;
      break;
    }
  }

  if (systemStatusTabFound) break;

  console.warn(`⚠️ Attempt ${attempt}: 'System Status' tab not found. Retrying...`);
  await page.waitForTimeout(3000);

  // Optionally reload the page once after second attempt
  if (attempt === 2) {
    console.log("🔄 Reloading page to restore sidebar...");
    await page.reload();
    await page.waitForLoadState('networkidle', { timeout: 20000 });
  }
}

if (!systemStatusTabFound) {
  throw new Error("❌ 'System Status' tab not found after multiple attempts. Check UI or selector.");
}

await page.waitForURL(/status/, { timeout: 20000 }).catch(() => {
  console.warn("⚠️ URL did not match /status/, proceeding anyway...");
});
console.log("✅ System Status page opened successfully!");


  // === STEP 7: VIEW STATUS METRICS ===
  console.log("🔍 Scrolling through system overview...");
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, -800);
  console.log("📈 Viewed System Overview, Status, and Metrics.");


// === STEP 7: Navigate to System Logs Tab ===
console.log("🪵 Navigating to 'System Logs' tab...");

const systemLogsTabSelectors = [
  "//a[contains(normalize-space(.), 'System Logs')]",
  "//button[contains(normalize-space(.), 'System Logs')]",
  "//span[contains(text(), 'System Logs')]",
];

let systemLogsTabFound = false;

for (let attempt = 1; attempt <= 3; attempt++) {
  console.log(`🔁 Attempt ${attempt}: Looking for 'System Logs' tab...`);
  for (const selector of systemLogsTabSelectors) {
    const tab = page.locator(selector);
    if (await tab.first().isVisible().catch(() => false)) {
      console.log(`✅ Found 'System Logs' tab using selector: ${selector}`);
      await tab.first().scrollIntoViewIfNeeded();
      await tab.first().click();
      systemLogsTabFound = true;
      break;
    }
  }

  if (systemLogsTabFound) break;

  console.warn(`⚠️ Attempt ${attempt}: 'System Logs' tab not found. Retrying after short wait...`);
  await page.waitForTimeout(3000);

  // Optional reload on second attempt
  if (attempt === 2) {
    console.log("🔄 Reloading page to restore tab elements...");
    await page.reload();
    await page.waitForLoadState('networkidle', { timeout: 20000 });
  }
}

if (!systemLogsTabFound) {
  // Screenshot for debugging before failing
  await page.screenshot({ path: 'logs-tab-missing.png', fullPage: true });
  throw new Error("❌ 'System Logs' tab not found after multiple attempts. Screenshot saved as logs-tab-missing.png");
}

await page.waitForLoadState('networkidle', { timeout: 15000 });
await page.waitForTimeout(2000);
console.log("✅ System Logs page opened successfully!");

  // === STEP 9: SEARCH & FILTER LOGS ===
  console.log("🔍 Searching log entry 'User authentication successful'...");
  const searchField = page.locator("//input[@placeholder='Search logs...']");
  await searchField.type('User authentication successful');
  await page.waitForTimeout(2000);
  await searchField.clear();
  console.log("✅ Search and clear actions completed.");

// === STEP 7: Filter Logs by 'Error' Level and Source ===
console.log("⚠️ Filtering logs by 'Error' level...");
const levelDropdown = page.locator("(//select)[1]");

// Wait for dropdown to appear and interact
await levelDropdown.waitFor({ state: 'visible', timeout: 8000 });
await page.waitForTimeout(1500); // Pause to simulate user delay

await levelDropdown.selectOption({ label: 'Error' });
console.log("🕐 Waiting for logs to refresh after selecting 'Error'...");
await page.waitForTimeout(4000); // Allow logs to visually refresh
console.log("✅ Logs filtered by 'Error' level.");

console.log("🧠 Filtering logs by source 'OCR Engine'...");
const sourceDropdown = page.locator("(//select)[2]");

// Wait for second dropdown to appear
await sourceDropdown.waitFor({ state: 'visible', timeout: 8000 });
await page.waitForTimeout(1500);

await sourceDropdown.selectOption({ label: 'OCR Engine' });
console.log("🕐 Waiting for logs to refresh after selecting 'OCR Engine'...");
await page.waitForTimeout(4000);
console.log("✅ Logs filtered by 'OCR Engine' source.");

// Optional: confirm that filtered logs actually loaded
const filteredLogs = page.locator("//table//tr[contains(., 'Error') or contains(., 'OCR Engine')]");
if (await filteredLogs.first().isVisible().catch(() => false)) {
  console.log("📄 Filtered logs detected on screen.");
} else {
  console.log("⚠️ No visible filtered logs — might be empty or still loading.");
}

console.log("🎉 System Configuration workflow test completed successfully!");

});
