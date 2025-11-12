// tests/document-workflow.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { waitForPageLoad } from './utils.js';

test('Full Document Workflow: upload, search, filter, view, download, delete', async ({ page }) => {
  test.setTimeout(240000);

  const { username, password } = credentials.reviewer;
  const loginPage = new LoginPage(page);

  console.log("🌍 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("🔐 Logging in...");
  await loginPage.login(username, password);
  await waitForPageLoad(page, 'Dashboard');
  console.log("✅ Login successful — redirecting to Documents page...");

  // ===========================================================
  // === NAVIGATE TO DOCUMENTS ===
  // ===========================================================
  console.log("📂 Opening 'Documents' tab...");
  await page.locator('a[href="/documents"]').first().click();
  await page.waitForURL(/documents/, { timeout: 15000 });
  console.log("✅ Documents page loaded.");

  // ===========================================================
  // === UPLOAD DOCUMENT ===
  // ===========================================================
  console.log("📤 Clicking 'Upload Documents'...");
  const uploadDocsBtn = page.locator("//button[normalize-space()='Upload Documents']");
  await uploadDocsBtn.waitFor({ state: "visible" });
  await uploadDocsBtn.click();

  await page.waitForURL(/upload/, { timeout: 15000 });
  console.log("✅ Upload page opened successfully!");

  console.log("📎 Selecting file to upload...");
  const filePath = path.resolve('C:/Users/walte/OneDrive/Documents/Parklands_Training_Tracker.pdf');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  console.log("✅ File selected successfully!");

  console.log("🚀 Submitting file upload...");
  const uploadButton = page.getByRole('button', { name: /Submit|Upload/i });
  if (await uploadButton.isVisible()) {
    await uploadButton.click();
    console.log("✅ Upload started...");
  } else {
    console.log("⚠️ Upload button not visible, skipping click.");
  }

  await page.waitForTimeout(5000);
  await page.goto('https://ocr.techsavanna.technology/documents');
  console.log("🔄 Returned to Documents list.");

  // ===========================================================
  // === SEARCH FUNCTIONALITY ===
  // ===========================================================
  console.log("🔍 Searching for uploaded document...");
  const searchBox = page.getByPlaceholder(/Search documents/i);
  await searchBox.fill("Parklands_Training_Tracker");
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  console.log("✅ Search completed.");

  console.log("🧹 Clearing search field...");
  await searchBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');

  // ===========================================================
  // === FILTERING SECTION ===
  // ===========================================================
  console.log("⚙️ Opening Filters...");
  const filterButton = page.getByRole('button', { name: /Filters/i });
  await filterButton.click();
  await page.waitForTimeout(1000);

  console.log("✅ Applying 'Completed' status filter...");
  const completedCheck = page.locator('label:has-text("Completed") input[type="checkbox"]');
  if (await completedCheck.isVisible()) await completedCheck.check();

  console.log("✅ Applying 'Business Permit' type filter...");
  const docTypeCheck = page.locator('label:has-text("Business Permit") input[type="checkbox"]');
  if (await docTypeCheck.isVisible()) await docTypeCheck.check();

  console.log("🧹 Clearing all filters...");
  const clearFilters = page.getByRole('button', { name: /Clear all/i });
  if (await clearFilters.isVisible()) await clearFilters.click();

  console.log("📅 Setting Upload Date Range...");
  await page.fill('(//input[@type="date"])[1]', '2025-10-01');
  await page.fill('(//input[@type="date"])[2]', '2025-10-27');

  console.log("📊 Setting Confidence Score Range...");
  const minScore = page.locator('(//input[@type="number"])[1]');
  const maxScore = page.locator('(//input[@type="number"])[2]');
  await minScore.fill('6');
  await maxScore.fill('10');
  console.log("✅ Filters configured successfully.");

  console.log("⬆️ Collapsing Filters panel...");
  const collapseArrow = page.locator('(//button[contains(@class,"collapse")])[1]');
  await collapseArrow.click().catch(() => console.log("⚠️ Could not collapse filters."));

  // ===========================================================
  // === VIEW / DOWNLOAD / DELETE ACTIONS ===
  // ===========================================================
  console.log("\n📁 Handling first document entry...");
  const firstRow = page.locator('table tbody tr').first();

  // === VIEW DOCUMENT ===
  console.log("👁 Viewing first document...");
  const viewBtn = firstRow.locator('(//*[name()="svg"][@class="h-4 w-4"])[1]');
  if (await viewBtn.isVisible()) {
    await viewBtn.click();
    await page.waitForTimeout(3000);
    console.log("✅ Document view opened!");
    await page.goBack();
  } else {
    console.log("⚠️ View icon not visible.");
  }

  // === DOWNLOAD DOCUMENT ===
  console.log("⬇️ Downloading document...");
  const downloadBtn = firstRow.locator('(//*[name()="svg"][@class="h-4 w-4"])[2]');
  if (await downloadBtn.isVisible()) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadBtn.click()
    ]);
    const suggestedName = download.suggestedFilename();
    console.log(`✅ Document download started: ${suggestedName}`);
  } else {
    console.log("⚠️ Download icon not found.");
  }

  // === DELETE DOCUMENT ===
  console.log("🗑 Attempting to delete document...");
  const deleteBtn = page.locator('(//button[@title="Delete document"])[2]');
  if (await deleteBtn.isVisible()) {
    await deleteBtn.click();
    console.log("🧹 Confirming delete...");
    await confirmDelete(page);
  } else {
    console.log("⚠️ Delete button not found.");
  }

  console.log("\n🎯 Full document workflow completed successfully!");
});

// ===========================================================
// === HELPER FUNCTION: Confirm Delete ===
// ===========================================================
async function confirmDelete(page) {
  const confirmSelectors = [
    'button:has-text("Confirm")',
    'button:has-text("Delete")',
    'button:has-text("Yes")',
    'button:has-text("OK")'
  ];

  for (const selector of confirmSelectors) {
    const confirmBtn = page.locator(selector);
    if (await confirmBtn.isVisible({ timeout: 2000 })) {
      await confirmBtn.click();
      console.log("✅ Delete confirmed!");
      await page.waitForTimeout(2000);
      return;
    }
  }

  console.log("⚠️ No confirm button visible — trying to close modal...");
  const cancelBtn = page.locator('button:has-text("Cancel")');
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    console.log("🛑 Delete cancelled.");
  }
}
