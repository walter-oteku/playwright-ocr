// tests/dashboard.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { waitForPageLoad } from './utils.js';

/**
 * Helper: Scroll to specific dashboard sections
 */
async function scrollToSection(page, sectionName) {
  console.log(`🔄 Scrolling to ${sectionName}...`);

  const scrollPositions = {
    top: 0,
    charts: 400,
    'recent-documents': 800,
  };

  const top = scrollPositions[sectionName] ?? 0;

  await page.evaluate((top) => {
    window.scrollTo({ top, behavior: 'smooth' });
  }, top);

  await page.waitForTimeout(2000);
}

/**
 * Hover over charts section and simulate mouse movements
 */
async function hoverChartsWithScrollbar(page) {
  console.log("\n📈 Starting chart hover with scrollbar positioning...");
  await scrollToSection(page, 'charts');
  await page.waitForTimeout(2000);

  const charts = page.locator('canvas');
  const count = await charts.count();

  console.log(`🎨 Found ${count} canvas charts`);

  for (let i = 0; i < count; i++) {
    const canvas = charts.nth(i);
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const box = await canvas.boundingBox();
    if (!box) continue;

    console.log(`📏 Chart ${i + 1}: x=${Math.round(box.x)}, y=${Math.round(box.y)}`);

    const hoverPoints = [0.25, 0.5, 0.75].map((pos) => ({
      x: box.x + box.width * pos,
      y: box.y + box.height / 2,
    }));

    for (const point of hoverPoints) {
      await page.mouse.move(point.x, point.y);
      console.log(`🖱️ Hovered chart ${i + 1} at x=${point.x.toFixed(0)}`);
      await page.waitForTimeout(800);
    }
  }

  console.log("✅ Chart hover sequence completed");
}

/**
 * Check recent documents section
 */
async function checkRecentDocuments(page) {
  console.log("\n📋 Checking recent documents section...");
  await scrollToSection(page, 'recent-documents');
  await page.waitForTimeout(2000);

  const titleSelectors = [
    'text=Recent Documents',
    'text=Recent Activity',
    'text=Document History'
  ];

  for (const selector of titleSelectors) {
    if (await page.locator(selector).first().isVisible().catch(() => false)) {
      console.log(`✅ Found recent documents title: ${selector}`);
      break;
    }
  }

  const rows = page.locator('tr, [class*="document"], [class*="list-item"]');
  const count = await rows.count();

  console.log(`📄 Found ${count} document items`);
  const limit = Math.min(count, 5);

  for (let i = 0; i < limit; i++) {
    const item = rows.nth(i);
    await item.scrollIntoViewIfNeeded();
    const text = await item.textContent().catch(() => '');
    console.log(`📝 Document ${i + 1}: ${text?.slice(0, 50) || '(no text)'}`);
    await item.hover();
    await page.waitForTimeout(500);
  }

  console.log("✅ Finished checking recent documents");
}

/**
 * === MAIN TEST: Dashboard Navigation ===
 */
test('Login → Dashboard Navigation (Charts + Documents)', async ({ page }) => {
  test.setTimeout(120000);

  // === LOGIN FLOW ===
  const loginPage = new LoginPage(page);
  const { username, password } = credentials.reviewer;

  console.log(`🌐 Navigating to login page as ${username}...`);
  await page.goto("https://ocr.techsavanna.technology/login");
  await page.waitForLoadState("domcontentloaded");

  console.log("🔐 Logging in...");
  await loginPage.login(username, password);

  await waitForPageLoad(page, 'Dashboard');
  await expect(page.locator("text=Dashboard")).toBeVisible({ timeout: 20000 });
  console.log("✅ Successfully logged in to dashboard!");

  // === QUICK ACTION CARDS ===
  console.log("\n⚡ Testing Quick Action cards...");

  const quickActions = [
    { name: "Upload Documents", selector: "(//h6[normalize-space()='Upload Documents']/ancestor::a)[1]" },
    { name: "Manual Review", selector: "(//h6[normalize-space()='Manual Review']/ancestor::a)[1]" },
    { name: "Pending Documents", selector: "(//h6[normalize-space()='Pending Documents']/ancestor::a)[1]" },
    { name: "Analytics", selector: "(//h6[normalize-space()='Analytics']/ancestor::a)[1]" },
    { name: "User Management", selector: "(//h6[normalize-space()='User Management']/ancestor::a)[1]" },
    { name: "System Settings", selector: "(//h6[normalize-space()='System Settings']/ancestor::a)[1]" },
  ];

  for (const { name, selector } of quickActions) {
    console.log(`🖱️ Clicking on: ${name}`);

    try {
      const card = page.locator(selector);
      await card.waitFor({ state: 'visible', timeout: 10000 });
      await card.scrollIntoViewIfNeeded();
      await card.click({ force: true });

      await page.waitForTimeout(3000);
      const sectionVisible = await page.locator(`text=${name}`).first().isVisible().catch(() => false);
      if (sectionVisible) {
        console.log(`✅ ${name} section loaded successfully!`);
      } else {
        console.log(`⚠️ ${name} section may not have loaded fully — check selector.`);
      }

      // Return to dashboard
      const dashboardButton = page.locator("(//h6[normalize-space()='Dashboard']/ancestor::a)[1]");
      await dashboardButton.waitFor({ state: 'visible', timeout: 10000 });
      await dashboardButton.click({ force: true });
      await page.waitForSelector("(//h6[normalize-space()='Upload Documents'])[1]", { timeout: 15000 });
      console.log("🔙 Returned to dashboard...");
    } catch (error) {
      console.log(`⚠️ Failed ${name}: ${error.message}`);
    }
  }

  // === CHARTS ===
  await hoverChartsWithScrollbar(page);

  // === RECENT DOCUMENTS ===
  await checkRecentDocuments(page);

  // === CLEANUP ===
  await scrollToSection(page, 'top');
  console.log("\n🎯 Full dashboard navigation sequence completed.");
});
