import { test, expect } from '@playwright/test';

test('Audit Logs dashboard interaction and filter flow', async ({ page }) => {
  test.setTimeout(180000);

  // === LOGIN FLOW ===
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

  // === STEP 1: Navigate to Audit Logs ===
console.log("📋 Navigating to 'Audit Logs' tab...");

const auditLogsTab = page.locator("(//a[normalize-space()='Audit Logs'])[1]");
await auditLogsTab.waitFor({ state: 'visible', timeout: 10000 });
await auditLogsTab.click();

console.log("⏳ Waiting for Audit Logs page to load...");
await page.waitForURL(/audit/, { timeout: 15000 });

console.log("✅ Audit Logs page loaded successfully!");
await page.waitForTimeout(2000);


  // === STEP 2: Hover over Dashboard Cards ===
  console.log("🧾 Hovering over summary cards...");
  const summaryCards = [
    "Total Logs",
    "Errors",
    "Warnings",
    "Success",
    "Active Users",
    "Document Actions",
    "System Actions",
    "Info Logs"
  ];

  for (const card of summaryCards) {
    const cardLocator = page.locator(`text=${card}`).first();
    if (await cardLocator.isVisible()) {
      await cardLocator.hover();
      console.log(`🪶 Hovered over card: ${card}`);
      await page.waitForTimeout(1200);
    }
  }

  // === STEP 3: Scroll to Filter Section ===
  console.log("🎛 Scrolling to filter section...");
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(2000);

 // === STEP 2: Click 'Show Filters' ===
console.log("🪟 Clicking 'Show Filters'...");

const showFilterBtn = page.locator("(//button[normalize-space()='Show Filters'])[1]");
await showFilterBtn.waitFor({ state: 'visible', timeout: 10000 });
await page.waitForTimeout(500); // 👀 tiny pause before clicking (feels natural)
await showFilterBtn.click();

console.log("✅ 'Show Filters' section displayed.");
await page.waitForTimeout(1500);


 // === STEP 4: Fill Filter Fields ===
console.log("✍️ Setting Start and End Dates...");

// Start Date
const startDate = page.locator("(//input[@value='2025-10-23'])[1]");
await startDate.waitFor({ state: 'visible', timeout: 10000 });
await startDate.fill('2025-10-23');
await page.waitForTimeout(1200);

// End Date
const endDate = page.locator("(//input[@value='2025-10-30'])[1]");
await endDate.waitFor({ state: 'visible', timeout: 10000 });
await endDate.fill('2025-10-30');
await page.waitForTimeout(1200);
console.log("📅 Dates filled successfully!");

// Action dropdown
console.log("🔽 Selecting 'Action' filter...");
const actionDropdown = page.locator("(//select[@class='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'])[1]");
await actionDropdown.waitFor({ state: 'visible', timeout: 10000 });
await actionDropdown.selectOption({ index: 1 });
await page.waitForTimeout(1000);
console.log("✅ Action filter selected!");

// Resource dropdown
console.log("🧩 Selecting 'Resource' filter...");
const resourceDropdown = page.locator("(//select[@class='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500'])[2]");
await resourceDropdown.waitFor({ state: 'visible', timeout: 10000 });
await resourceDropdown.selectOption({ index: 1 });
await page.waitForTimeout(1000);
console.log("✅ Resource filter selected!");

// User ID input
console.log("🆔 Entering User ID...");
const userIdField = page.locator("(//input[@placeholder='Enter user ID...'])[1]");
await userIdField.waitFor({ state: 'visible', timeout: 10000 });
await userIdField.fill('1');
await page.waitForTimeout(1500);
console.log("✅ User ID set to 1.");


  // === STEP 5: Select and View Audit Log ===
console.log("📜 Selecting a specific audit log entry...");

const viewIcon = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[1]");
await viewIcon.waitFor({ state: 'visible', timeout: 5000 });
await viewIcon.click();

console.log("👁️ Audit log details opened.");
await page.waitForTimeout(2000);


// === STEP 6: Close Audit Log Modal ===
console.log("❌ Closing audit log details modal...");

const closeModal = page.locator("(//*[name()='svg'][@class='h-6 w-6'])[3]");
await closeModal.waitFor({ state: 'visible', timeout: 5000 });
await page.waitForTimeout(1000); // Give the modal a beat to fully render
await closeModal.click();

console.log("✅ Audit log modal closed successfully!");
await page.waitForTimeout(1500); // Ensure modal transition finishes before next step


  // === STEP 7: Wrap Up ===
  await page.waitForTimeout(2000);
  console.log("🎉 Completed full audit log filter and view flow smoothly!");
});
