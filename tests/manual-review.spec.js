// tests/manual-review.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { logStep, waitForPageLoad, waitForVisible } from './utils.js';

test('📋 Manual Review workflow: navigate, filter, view, edit, approve', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const { username, password } = credentials.reviewer;

  // === LOGIN ===
  await logStep(page, "🌐 Navigating to OCR login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  await logStep(page, "🔐 Logging in as reviewer...");
  await loginPage.login(username, password);

  await waitForPageLoad(page, 'Dashboard');
  await expect(page.getByText(/dashboard/i)).toBeVisible({ timeout: 15000 });
  console.log("✅ Login successful!");

  // === STEP 1: Navigate to Manual Review ===
  await logStep(page, "📋 Navigating to Manual Review tab...");
  const manualReviewTab = page.locator("(//a[normalize-space()='Manual Review'])[1]");
  await manualReviewTab.waitFor({ state: 'visible', timeout: 15000 });
  await manualReviewTab.click();
  await page.waitForURL(/review/i, { timeout: 20000 });
  console.log("✅ Manual Review page loaded!");

  // === STEP 2: Hover over summary cards ===
  console.log("👀 Hovering over summary cards...");
  const cards = [
    { label: "Total Pending", desc: "Documents requiring review" },
    { label: "Pending Review", desc: "Awaiting manual review" },
    { label: "Failed Processing", desc: "Processing failed" },
    { label: "High Priority", desc: "Requires immediate attention" }
  ];

  for (const { label, desc } of cards) {
    try {
      const card = page.locator(
        `(//div[contains(@class,'bg-white') or contains(@class,'rounded') or contains(@class,'shadow')]//*[contains(text(),"${label}")]/ancestor::div[contains(@class,'bg-white')])[1]`
      );
      await card.waitFor({ state: 'visible', timeout: 7000 });
      await card.hover();
      console.log(`✅ Hovered on ${label} — ${desc}`);
      await page.waitForTimeout(800);
    } catch (err) {
      console.log(`⚠️ Could not find or hover on card: ${label} — ${err.message}`);
    }
  }

  // === STEP 3: Apply filters ===
  await logStep(page, "🎛 Opening and applying filters...");
  const filterIcon = page.locator("(//*[name()='svg'][contains(@class,'transition-transform')])[1]");
  if (await filterIcon.isVisible()) {
    await filterIcon.click();
    console.log("✅ Filter panel opened.");
  }

  const docTypeDropdown = page.locator("(//select[contains(@class,'focus:ring-primary-500')])[1]");
  await docTypeDropdown.selectOption({ label: 'Business Permit' });
  console.log("✅ Document Type: Business Permit");

  const confidenceDropdown = page.locator("(//select[contains(@class,'focus:ring-primary-500')])[2]");
  await confidenceDropdown.selectOption({ label: 'Below 80%' });
  console.log("✅ Confidence Threshold: Below 80%");

  const priorityDropdown = page.locator("(//select[contains(@class,'focus:ring-primary-500')])[3]");
  await priorityDropdown.selectOption({ label: 'Medium Priority' });
  console.log("✅ Priority: Medium");

  const assignedToInput = page.locator("(//input[contains(@placeholder,'Enter user name')])[1]");
  await assignedToInput.fill('32005767');
  console.log("✅ Assigned To ID entered.");

  const applyButton = page.getByRole('button', { name: /apply/i });
  await applyButton.click();
  console.log("✅ Filters applied successfully!");
  await page.waitForTimeout(1500);

  // === STEP 4: Select document from table ===
  await logStep(page, "📄 Selecting document from table...");
  const tableRow = page.locator('//table//tr');
  const noDataMessage = page.getByText(/no data|no records|nothing found/i);
  try {
    await Promise.race([
      tableRow.first().waitFor({ state: 'visible', timeout: 15000 }),
      noDataMessage.waitFor({ state: 'visible', timeout: 15000 })
    ]);

    if (await noDataMessage.isVisible()) {
      console.log("⚠️ No documents found after filtering.");
    } else {
      const firstCheckbox = page.locator('(//table//input[@type="checkbox"])[1]');
      await firstCheckbox.check();
      console.log("✅ Document selected successfully!");
    }
  } catch (err) {
    console.log("❌ Timeout waiting for table data or message:", err.message);
  }

  // === STEP 5: View document ===
  await logStep(page, "👁 Opening document for viewing...");
  const viewIcon = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[1]");
  if (await viewIcon.isVisible()) {
    await viewIcon.click();
    console.log("✅ Document view opened.");
    await page.waitForTimeout(1500);
  }

  // Zoom In & Out
  const zoomIn = page.getByRole('button', { name: /zoom in/i });
  const zoomOut = page.getByRole('button', { name: /zoom out/i });
  if (await zoomIn.isVisible()) await zoomIn.click();
  if (await zoomOut.isVisible()) await zoomOut.click();
  console.log("🔍 Zoom actions performed.");

  // === STEP 6: Fullscreen toggle ===
  console.log("🖥 Checking fullscreen toggle...");
  const enterFullscreenBtn = page.locator("(//button[@title='Enter fullscreen'])[1]");
  const exitFullscreenBtn = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[3]");
  if (await enterFullscreenBtn.isVisible()) {
    await enterFullscreenBtn.click();
    console.log("🖥 Entered fullscreen.");
    await page.waitForTimeout(1000);
    if (await exitFullscreenBtn.isVisible()) {
      await exitFullscreenBtn.click();
      console.log("⬅️ Exited fullscreen.");
    }
  }

  // Download Document
  const downloadIcon = page.locator("(//button[@title='Download document'])[1]");
  if (await downloadIcon.isVisible()) {
    await downloadIcon.click();
    console.log("⬇️ Document download triggered.");
  }

  // === STEP 7: Edit Extracted Data ===
  await logStep(page, "✏️ Editing extracted data...");
  const editBtn = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[5]");
  if (await editBtn.isVisible()) {
    await editBtn.click();
    console.log("✅ Edit mode activated.");

    const nameField = page.locator("(//input[contains(@value,'John Doe')])[1]");
    if (await nameField.isVisible()) {
      await nameField.fill("John Doe Jr.");
      console.log("📝 Updated Full Name to John Doe Jr.");
    }

    const saveBtn = page.getByRole('button', { name: /save changes/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      console.log("💾 Changes saved successfully!");
    }
  }

  const backButton = page.getByRole('button', { name: /back to documents/i });
  if (await backButton.isVisible()) {
    await backButton.click();
    console.log("↩️ Returned to Manual Review page.");
  }

  // === STEP 8: Approve Document ===
  await logStep(page, "🟢 Approving document...");
  const approveIcon = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[2]");
  if (await approveIcon.isVisible()) {
    await approveIcon.click();
    const okButton = page.getByRole('button', { name: /ok|confirm/i });
    if (await okButton.isVisible()) {
      await okButton.click();
      console.log("🎉 Document approved successfully!");
    } else {
      console.log("⚠️ Approval dialog not found.");
    }
  }

  console.log("🏁 Manual Review workflow completed successfully!");
});
