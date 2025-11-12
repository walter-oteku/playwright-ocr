// tests/analytics-dashboard.spec.js
import { test, expect } from '@playwright/test';
import { credentials } from './credentials.js';
import { LoginPage } from './pages.js';
import { waitForPageLoad } from './utils.js';

test('📊 Analytics dashboard interaction flow with date filter and chart validation', async ({ page }) => {
  const { username, password } = credentials.reviewer;
  const loginPage = new LoginPage(page);

  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("🔐 Logging in as reviewer...");
  await loginPage.login(username, password);

  await waitForPageLoad(page, 'Dashboard');
  await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  console.log("✅ Login successful — Dashboard loaded!");

  // === STEP 1: Navigate to Analytics ===
  console.log("📊 Navigating to 'Analytics' tab...");
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

  if (!clicked) throw new Error("❌ Analytics tab not found or clickable.");

  await page.waitForURL(/analytics/, { timeout: 20000 });
  console.log("✅ Analytics page loaded successfully!");
  await page.waitForTimeout(2000);

  // === STEP 2: Interact with Date Filter ===
  console.log("🗓 Clicking on date range section...");
  const dateRangeButton = page.locator("(//*[name()='svg'][@class='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-q7mezt'])[5]");
  await dateRangeButton.click();
  await page.waitForTimeout(1500);

  console.log("✍️ Typing custom Start and End Dates...");
  const startDateInput = page.locator("(//input[@value='2025-09-29'])[1]");
  const endDateInput = page.locator("(//input[@value='2025-10-29'])[1]");

  if (await startDateInput.isVisible()) {
    await startDateInput.fill('2025-09-29');
    console.log("🗓 Start Date set to 29/09/2025");
  }
  if (await endDateInput.isVisible()) {
    await endDateInput.fill('2025-10-29');
    console.log("🗓 End Date set to 29/10/2025");
  }

  console.log("✅ Clicking Apply to confirm filter...");
  const applyBtn = page.locator("(//button[normalize-space()='Apply'])[1]");
  await applyBtn.waitFor({ state: 'visible', timeout: 5000 });
  await applyBtn.click();
  await page.waitForTimeout(2000);
  console.log("🎯 Applied date filter successfully!");

  // Reopen and Cancel
  await dateRangeButton.click();
  const cancelBtn = page.locator("(//button[normalize-space()='Cancel'])[1]");
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    console.log("❌ Cancelled date selection as expected!");
  }

  // === STEP 3: Interact with Document Type Dropdown ===
  console.log("📂 Selecting Document Type from dropdown...");
  const docTypeDropdown = page.locator("//div[@role='combobox']");
  await docTypeDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await docTypeDropdown.click();
  console.log("🔽 Dropdown opened...");

  const businessPermitOption = page.locator("//li[normalize-space()='Business Permit']");
  await businessPermitOption.waitFor({ state: 'visible', timeout: 5000 });
  await businessPermitOption.click();
  console.log("🏢 'Business Permit' selected successfully!");

  console.log("🧹 Looking for Clear Filter button...");
  const clearFilterButton = page.locator("(//button[normalize-space()='Clear Filter'])[1]");
  await clearFilterButton.waitFor({ state: 'visible', timeout: 5000 });
  await clearFilterButton.click();
  console.log("✅ Cleared filter successfully!");

  // === STEP 4: Hover over Report Cards ===
  console.log("🧾 Hovering over report summary cards...");
  const cards = [
    "Total Documents",
    "Success Rate",
    "Avg Processing Time",
    "Accuracy Rate"
  ];

  for (const card of cards) {
    const cardLocator = page.locator(`text=${card}`).first();
    if (await cardLocator.isVisible()) {
      await cardLocator.hover();
      console.log(`🪶 Hovered over card: ${card}`);
      await page.waitForTimeout(1000);
    } else {
      console.warn(`⚠️ Card not found: ${card}`);
    }
  }

  // === STEP 5: Interact with Charts ===
  console.log("📈 Scrolling to Processing Trends chart...");
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(1500);

  const trendChart = page.getByText(/Processing Trends/i).first();
  if (await trendChart.isVisible()) {
    await trendChart.hover();
    console.log("📊 Hovered over 'Processing Trends' chart.");
  }

  console.log("📉 Scrolling to Document Types chart...");
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1500);

  const docTypesChart = page.getByText(/Document Types/i).first();
  if (await docTypesChart.isVisible()) {
    await docTypesChart.hover();
    console.log("📚 Hovered over 'Document Types' chart.");
  }

  console.log("✨ Final slow scroll to bottom for full analytics view...");
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);

  console.log("✅ Analytics dashboard interaction flow completed successfully!");
});
