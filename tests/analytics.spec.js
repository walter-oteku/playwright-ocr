
import { test, expect } from '@playwright/test';

test('Analytics dashboard interaction flow with date filter', async ({ page }) => {
  test.setTimeout(180000);

  // === LOGIN ===
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

  // === STEP 1: Navigate to Analytics ===
  console.log("📊 Navigating to 'Analytics' tab...");
  await page.locator('(//a[normalize-space()="Analytics"])[1]').click();
  await page.waitForURL(/analytics/, { timeout: 10000 });
  console.log("✅ Analytics page loaded successfully!");
  await page.waitForTimeout(2000);

  // === STEP 2: Interact with Date Filter ===
  console.log("🗓 Clicking on date range section...");
  const dateRangeButton = page.locator("(//*[name()='svg'][@class='h-4 w-4 text-gray-400'])[1]");
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
