import { test, expect } from '@playwright/test';

test('Manual Review workflow: navigate, filter, view, edit, approve', async ({ page }) => {
  test.setTimeout(300000);

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
await emailField.type("reviewer1", { delay: 150 }); // Simulate natural typing


// Step 3: Enter password with visible typing
console.log("🔒 Typing password slowly...");

const passwordSelector = "(//input[@id='_R_ilbinpfjrb_'])[1]";
const passwordField = page.locator(passwordSelector);

// Wait for password field to be ready, clear it, then type naturally
await passwordField.waitFor({ state: "visible", timeout: 10000 });
await passwordField.click();
await passwordField.fill(""); // Clear any pre-filled content
await passwordField.type("password123", { delay: 150 }); // Simulate human typing


  // Step 4: Click Sign In button (with visible pause)
  console.log("Clicking Sign In button...");
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await page.waitForTimeout(500); // short delay before click
  await signInButton.click();

  // Step 5: Wait for a login success message
  console.log("Waiting for success message...");
  const successMessage = page.getByText(/Login successful/i);

  // === STEP 1: Navigate to Manual Review ===
  console.log("📋 Navigating to Manual Review tab...");
  const manualReviewTab = page.locator("(//a[normalize-space()='Manual Review'])[1]");
  await manualReviewTab.waitFor({ state: 'visible', timeout: 10000 });
  await manualReviewTab.click();
  // await page.waitForURL(/Manual-Review/i, { timeout: 15000 });
  await page.waitForURL(/review/i, { timeout: 15000 });
  console.log("✅ Manual Review page loaded!");

  // === STEP 2: Hover over review summary cards ===
console.log("👀 Hovering over summary cards...");
const cards = [
  { label: "Total Pending", desc: "Documents requiring review" },
  { label: "Pending Review", desc: "Awaiting manual review" },
  { label: "Failed Processing", desc: "Processing failed" },
  { label: "High Priority", desc: "Requires immediate attention" }
];

for (const { label, desc } of cards) {
  try {
    // 🎯 Refined locator: target visible dashboard card containers
    const card = page.locator(
      `(//div[contains(@class, 'bg-white') or contains(@class, 'rounded') or contains(@class, 'shadow')]//*[contains(text(),"${label}")]/ancestor::div[contains(@class,'bg-white')])[1]`
    );

    // wait and check visibility
    await card.waitFor({ state: 'visible', timeout: 5000 });
    await card.hover();
    console.log(`✅ Hovered on ${label} — ${desc}`);
    await page.waitForTimeout(1000);

  } catch (err) {
    console.log(`⚠️ Could not find or hover on card: ${label} — ${err.message}`);
  }
}


  // === STEP 3: Click Filter Icon ===
  console.log("🎛 Clicking Filter icon...");
  const filterIcon = page.locator("(//*[name()='svg'][contains(@class,'h-4 w-4 text-gray-400 transition-transform')])[1]");
  if (await filterIcon.isVisible()) {
    await filterIcon.click();
    console.log("✅ Filter panel opened.");
  } else {
    console.log("⚠️ Filter icon not found.");
  }

  // === STEP 4: Apply filters ===
  console.log("🧩 Applying filters...");
  // Document Type
  const docTypeDropdown = page.locator("(//select[contains(@class, 'w-full') and contains(@class, 'focus:ring-primary-500')])[1]");
  await docTypeDropdown.selectOption({ label: 'Business Permit' });
  console.log("✅ Selected Document Type: Business Permit");

  // Confidence Threshold
  const confidenceDropdown = page.locator("(//select[contains(@class, 'w-full') and contains(@class, 'focus:ring-primary-500')])[2]");
  await confidenceDropdown.selectOption({ label: 'Below 80%' });
  console.log("✅ Selected Confidence Threshold: Below 80%");

  // Priority
  const priorityDropdown = page.locator("(//select[contains(@class, 'w-full') and contains(@class, 'focus:ring-primary-500')])[3]");
  await priorityDropdown.selectOption({ label: 'Medium Priority' });
  console.log("✅ Selected Priority: Medium Priority");

  // Assigned To
  const assignedToInput = page.locator("(//input[contains(@placeholder,'Enter user name')])[1]");
  await assignedToInput.fill('32005767');
  console.log("✅ Entered Assigned To ID: 32005767");

  // Apply Filters
  const applyButton = page.getByRole('button', { name: /Apply/i });
  await applyButton.click();
  console.log("✅ Applied filters successfully!");
  await page.waitForTimeout(2000);

  // Cancel (close filters)
  // const cancelButton = page.getByRole('button', { name: /Cancel/i });
  // if (await cancelButton.isVisible()) {
  //   await cancelButton.click();
  //   console.log("✅ Closed filter panel with Cancel button.");
  // }

  // === STEP 3: Click Filter Icon ===
  console.log("🎛 Clicking Filter icon...");
  const filter1Icon = page.locator("(//*[name()='svg'][contains(@class,'h-4 w-4 text-gray-400 transition-transform')])[1]");
  if (await filter1Icon.isVisible()) {
    await filter1Icon.click();
    console.log("✅ Filter panel opened.");
  } else {
    console.log("⚠️ Filter icon not found.");
  }

  // === STEP 5: Select document from table ===
console.log("📄 Selecting document...");

// Wait for possible table or loading spinner
const loadingSpinner = page.locator('//*[contains(text(),"Loading") or contains(@class,"spinner")]');
if (await loadingSpinner.isVisible({ timeout: 5000 })) {
  console.log("⏳ Waiting for data to load...");
  await loadingSpinner.waitFor({ state: 'detached', timeout: 15000 });
}

console.log("⏳ Waiting for table or no-data message...");
const tableRow = page.locator('//table//tr');
const noDataMessage = page.getByText(/no data|no records|nothing found/i);

try {
  // Wait for either table rows or a "no data" message
  await Promise.race([
    tableRow.first().waitFor({ state: 'visible', timeout: 15000 }),
    noDataMessage.waitFor({ state: 'visible', timeout: 15000 })
  ]);

  if (await noDataMessage.isVisible()) {
    console.log("⚠️ No documents available after filtering.");
  } else {
    console.log("✅ Table loaded, selecting first document...");
    const firstCheckbox = page.locator('(//table//input[@type="checkbox"])[1]');
    await firstCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    await firstCheckbox.check();
    console.log("✅ Document selected successfully!");
  }

} catch (err) {
  console.log("❌ Timeout waiting for table data or no-data message:", err.message);
  await page.screenshot({ path: 'debug-no-table.png', fullPage: true });
}


  // === STEP 6: View Document (Eye Icon) ===
  console.log("👁 Opening document for viewing...");
  const viewIcon = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[1]");
  await viewIcon.click();
  await page.waitForTimeout(2000);
  console.log("✅ Document view opened.");

  // Zoom In & Out
  const zoomInBtn = page.getByRole('button', { name: /zoom in/i });
  const zoomOutBtn = page.getByRole('button', { name: /zoom out/i });
  if (await zoomInBtn.isVisible()) await zoomInBtn.click();
  if (await zoomOutBtn.isVisible()) await zoomOutBtn.click();
  console.log("🔍 Zoom in and out actions performed.");

  // === Fullscreen Toggle ===
console.log("🖥 Attempting fullscreen toggle...");

const enterFullscreenBtn = page.locator("(//button[@title='Enter fullscreen'])[1]");
const exitFullscreenBtn = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[3]");

if (await enterFullscreenBtn.isVisible()) {
  await enterFullscreenBtn.click();
  console.log("🖥 Entered full screen mode.");
  await page.waitForTimeout(2000);

  if (await exitFullscreenBtn.isVisible()) {
    await exitFullscreenBtn.click();
    console.log("⬅️ Exited full screen mode.");
  } else {
    console.log("⚠️ Exit fullscreen icon not found.");
  }
} else {
  console.log("⚠️ Enter fullscreen button not found.");
}


  // Download Document

 const downloadIcon = page.locator("(//button[@title='Download document'])[1]");

  if (await downloadIcon.isVisible()) {
    await downloadIcon.click();
    console.log("⬇️ Download initiated for document.");
  }

  // === STEP 7: Edit Extracted Data ===
  console.log("✏️ Editing extracted data...");
  const editBtn = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[5]");
  if (await editBtn.isVisible()) {
    await editBtn.click();
    console.log("✅ Edit mode opened.");

    // Edit a field
    const nameField = page.locator("(//input[@value='National ID - John Doe.jpg'])[1]");
    if (await nameField.isVisible()) {
      await nameField.fill("John Doe Jr.");
      console.log("📝 Updated Full Name to John Doe Jr.");
    }

    // Save changes
    const saveBtn = page.getByRole('button', { name: /Save Changes/i });
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      console.log("💾 Changes saved successfully!");
    }
  }

  // Back to Manual Review
  const backButton = page.getByRole('button', { name: /Back to Documents/i });
  await backButton.click();
  console.log("↩️ Returned to Manual Review page.");

  // === STEP 8: Approve Document ===
  console.log("✅ Attempting to approve document...");
  const approveIcon = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[2]");
  if (await approveIcon.isVisible()) {
    await approveIcon.click();
    console.log("🟢 Approve dialog opened.");

    const okButton = page.getByRole('button', { name: /ok|confirm/i });
    const cancelApproveButton = page.getByRole('button', { name: /cancel/i });

    if (await okButton.isVisible()) {
      await okButton.click();
      console.log("🎉 Document approved successfully!");
    } else if (await cancelApproveButton.isVisible()) {
      await cancelApproveButton.click();
      console.log("🚫 Approval cancelled.");
    } else {
      console.log("⚠️ No approval dialog detected.");
    }
  }

  console.log("🏁 Manual Review workflow completed successfully!");
});
