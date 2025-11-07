
import { test, expect } from '@playwright/test';

test('Analytics dashboard interaction flow with date filter', async ({ page }) => {
  test.setTimeout(180000);

  // === LOGIN ===
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

 
console.log("⏳ Waiting for dashboard to load after login...");
await page.waitForSelector('text=Dashboard', { timeout: 20000 }).catch(() => {
  console.warn("⚠️ Dashboard not found — trying alternate selector...");
});
await page.waitForTimeout(2000);

// === STEP 1: Navigate to Analytics ===
console.log("📊 Navigating to 'Analytics' tab...");

// Try a few possible locators to handle UI variations
const analyticsLocators = [
  'text=Analytics',
  '//a[contains(., "Analytics")]',
  '//span[normalize-space()="Analytics"]',
  'role=link[name="Analytics"]'
];

let clicked = false;
for (const selector of analyticsLocators) {
  const locator = page.locator(selector).first();
  if (await locator.isVisible()) {
    await locator.click({ timeout: 5000 });
    clicked = true;
    console.log(`✅ Clicked Analytics tab using selector: ${selector}`);
    break;
  }
}

if (!clicked) {
  throw new Error("❌ Analytics tab not found or clickable. Check selector or login flow.");
}

await page.waitForURL(/analytics/, { timeout: 20000 });
console.log("✅ Analytics page loaded successfully!");
await page.waitForTimeout(2000);


  // === STEP 2: Interact with Date Filter ===
  console.log("🗓 Clicking on date range section...");
 const dateRangeButton = page.locator("(//*[name()='svg'][@class='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-q7mezt'])[5]");
  await dateRangeButton.click();
  console.log("📅 Date picker opened!");
  await page.waitForTimeout(1500);

  // === STEP 2B: Fill Custom Range ===
  console.log("✍️ Typing custom Start and End Dates...");
  const startDateInput = page.locator("(//input[@value='2025-09-29'])[1]");
  const endDateInput = page.locator("(//input[@value='2025-10-29'])[1]");

  if (await startDateInput.isVisible()) {
    await startDateInput.click();
    await page.waitForTimeout(1000);
    await startDateInput.fill('2025-09-29');
    console.log("🗓 Start Date set to 29/09/2025");
  }

  if (await endDateInput.isVisible()) {
    await endDateInput.click();
    await page.waitForTimeout(1000);
    await endDateInput.fill('2025-10-29');
    console.log("🗓 End Date set to 29/10/2025");
  }

  // === STEP 2C: Apply Date Range ===
  console.log("✅ Clicking Apply to confirm filter...");
  const applyBtn = page.locator("(//button[normalize-space()='Apply'])[1]");
  await applyBtn.waitFor({ state: 'visible', timeout: 5000 });
  await applyBtn.click();
  console.log("🎯 Applied date filter successfully!");
  await page.waitForTimeout(2000);

  // === STEP 2D: Reopen and Cancel ===
  await dateRangeButton.click();
  console.log("🌀 Reopened date picker to test Cancel flow...");
  await page.waitForTimeout(1000);

  const cancelBtn = page.locator("(//button[normalize-space()='Cancel'])[1]");
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    console.log("❌ Cancelled date selection as expected!");
  }
  await page.waitForTimeout(2000);

    // === STEP 3: Interact with Document Type Dropdown ===
  console.log("📂 Selecting Document Type from dropdown...");

  const docTypeDropdown = page.locator("//div[@role='combobox']");
  await docTypeDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await docTypeDropdown.click();
  console.log("🔽 Dropdown opened...");

  // Select 'Business Permit' option
  const businessPermitOption = page.locator("//li[normalize-space()='Business Permit']");
  await businessPermitOption.waitFor({ state: 'visible', timeout: 5000 });
  await businessPermitOption.click();
  console.log("🏢 'Business Permit' selected successfully!");

  await page.waitForTimeout(1500);

  // === STEP 3B: Click Clear Filter Button ===
  console.log("🧹 Looking for Clear Filter button...");
  const clearFilterButton = page.locator("(//button[normalize-space()='Clear Filter'])[1]");
  
  await clearFilterButton.waitFor({ state: 'visible', timeout: 5000 });
  await clearFilterButton.click();
  console.log("✅ Cleared filter successfully!");

  await page.waitForTimeout(2000);


  // === STEP 3: Hover over Report Cards (with relaxed speed) ===
  console.log("🧾 Hovering over report summary cards...");
  const cards = [
    "Total Documents",
    "Success Rate",
    "Avg Processing Time",
    "Accuracy Rate"
  ];

  for (const card of cards) {
    // pick the first visible match only
    const cardLocator = page.locator(`text=${card}`).first();
    if (await cardLocator.isVisible()) {
      await cardLocator.hover();
      console.log(`🪶 Hovered over card: ${card}`);
      await page.waitForTimeout(1500);
    } else {
      console.warn(`⚠️ Card not found: ${card}`);
    }
  }

  // === STEP 4: Scroll and Interact with Charts ===
  console.log("📈 Scrolling to Processing Trends chart...");
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(2000);

  const trendChart = page.getByText(/Processing Trends/i).first();
  if (await trendChart.isVisible()) {
    await trendChart.hover();
    console.log("📊 Hovered over 'Processing Trends' chart.");
  }
  await page.waitForTimeout(1500);

  console.log("📉 Scrolling to Document Types chart...");
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(2000);

  const docTypesChart = page.getByText(/Document Types/i).first();
  if (await docTypesChart.isVisible()) {
    await docTypesChart.hover();
    console.log("📚 Hovered over 'Document Types' chart.");
  }

  console.log("✨ Final slow scroll to bottom for full analytics view...");
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2500);

  console.log("✅ Analytics dashboard interaction flow completed smoothly and human-like!");
});
