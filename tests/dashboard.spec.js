// import { test, expect } from '@playwright/test';

// // Function to scroll to specific sections
// async function scrollToSection(page, sectionName) {
//   console.log(`🔄 Scrolling to ${sectionName}...`);
  
//   switch(sectionName) {
//     case 'charts':
//       // Scroll to charts section (line graph and pie chart)
//       await page.evaluate(() => {
//         window.scrollTo({
//           top: 400,
//           behavior: 'smooth'
//         });
//       });
//       await page.waitForTimeout(2000);
//       break;
      
//     case 'recent-documents':
//       // Scroll further down to recent documents section
//       await page.evaluate(() => {
//         window.scrollTo({
//           top: 800,
//           behavior: 'smooth'
//         });
//       });
//       await page.waitForTimeout(2000);
//       break;
      
//     case 'top':
//       // Scroll back to top
//       await page.evaluate(() => {
//         window.scrollTo({
//           top: 0,
//           behavior: 'smooth'
//         });
//       });
//       await page.waitForTimeout(1000);
//       break;
//   }
// }

// // Function to hover over charts with scrollbar positioning
// async function hoverChartsWithScrollbar(page) {
//   console.log("\n📈 Starting chart hover with scrollbar positioning...");
  
//   // First scroll to the charts section
//   await scrollToSection(page, 'charts');
  
//   // Wait for charts to load after scrolling
//   await page.waitForTimeout(3000);
  
//   console.log("🔍 Looking for charts after scrolling...");
  
//   // Method 1: Try to find charts by their titles first
//   const hasProcessingTrends = await page.locator('text=Processing Trends').first().isVisible().catch(() => false);
//   const hasDocumentTypes = await page.locator('text=Document Types').first().isVisible().catch(() => false);
  
//   console.log(`📊 Processing Trends visible: ${hasProcessingTrends}`);
//   console.log(`📈 Document Types visible: ${hasDocumentTypes}`);

//   // Method 2: Find all canvas elements
//   const canvases = page.locator('canvas');
//   const canvasCount = await canvases.count().catch(() => 0);
//   console.log(`🎨 Found ${canvasCount} canvas elements`);

//   if (canvasCount === 0) {
//     console.log("❌ No canvas elements found for charts");
//     return;
//   }

//   // Hover over each canvas with scrollbar positioning
//   for (let i = 0; i < canvasCount; i++) {
//     try {
//       console.log(`\n🖱️ Processing chart ${i + 1}/${canvasCount}...`);
//       const canvas = canvases.nth(i);
      
//       // Ensure chart is properly positioned in viewport with scrollbar
//       await canvas.scrollIntoViewIfNeeded();
//       await page.waitForTimeout(1000);
      
//       // Get chart position for precise hovering
//       const box = await canvas.boundingBox();
//       if (box) {
//         console.log(`📏 Chart ${i + 1} position: x=${Math.round(box.x)}, y=${Math.round(box.y)}`);
        
//         // Hover over different parts of the chart to simulate user interaction
//         const hoverPoints = [
//           { x: box.x + box.width * 0.25, y: box.y + box.height * 0.5, label: "left-quarter" },
//           { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5, label: "center" },
//           { x: box.x + box.width * 0.75, y: box.y + box.height * 0.5, label: "right-quarter" },
//         ];
        
//         for (const point of hoverPoints) {
//           await page.mouse.move(point.x, point.y);
//           console.log(`📍 Hovered at ${point.label} position`);
//           await page.waitForTimeout(1000);
//         }
        
//         console.log(`✅ Successfully completed comprehensive hover for chart ${i + 1}`);
//       } else {
//         // Fallback: simple hover
//         await canvas.hover();
//         console.log(`✅ Hovered over chart ${i + 1} (simple method)`);
//         await page.waitForTimeout(2000);
//       }
      
//     } catch (canvasError) {
//       console.warn(`❌ Could not hover over chart ${i + 1}: ${canvasError.message}`);
//     }
//   }
// }

// // Function to check recent documents with scrollbar
// async function checkRecentDocuments(page) {
//   console.log("\n📋 Checking recent documents section...");
  
//   // Scroll down to recent documents section
//   await scrollToSection(page, 'recent-documents');
  
//   await page.waitForTimeout(2000);
  
//   // Look for recent documents section
//   try {
//     // Try to find recent documents by common section titles
//     const recentDocsSelectors = [
//       'text=Recent Documents',
//       'text=Recent Activity',
//       'text=Latest Documents',
//       'text=Document History',
//       'text=Recent Uploads'
//     ];
    
//     let recentDocsSection = null;
//     for (const selector of recentDocsSelectors) {
//       recentDocsSection = page.locator(selector).first();
//       if (await recentDocsSection.isVisible({ timeout: 5000 })) {
//         console.log(`✅ Found recent documents section: ${selector}`);
//         break;
//       }
//     }
    
//     if (!recentDocsSection || !(await recentDocsSection.isVisible())) {
//       console.log("⚠️ No specific recent documents title found, looking for document lists...");
//     }
    
//     // Look for document lists or tables
//     const documentRows = page.locator('tr, [class*="document"], [class*="file"], .list-item, .item');
//     const rowCount = await documentRows.count().catch(() => 0);
//     console.log(`📄 Found ${rowCount} potential document rows/items`);
    
//     if (rowCount > 0) {
//       // Scroll through some document items
//       const itemsToCheck = Math.min(rowCount, 5); // Check first 5 items max
//       for (let i = 0; i < itemsToCheck; i++) {
//         try {
//           const item = documentRows.nth(i);
//           await item.scrollIntoViewIfNeeded();
//           await page.waitForTimeout(500);
          
//           // Get item text to verify it's a document
//           const itemText = await item.textContent().catch(() => '');
//           if (itemText && itemText.length > 0) {
//             console.log(`📝 Document ${i + 1}: ${itemText.substring(0, 50)}...`);
//           }
          
//           // Hover over the document item
//           await item.hover();
//           console.log(`👆 Hovered over document item ${i + 1}`);
//           await page.waitForTimeout(800);
          
//         } catch (itemError) {
//           console.warn(`❌ Could not process document item ${i + 1}: ${itemError.message}`);
//         }
//       }
//     } else {
//       console.log("❌ No document items found in recent documents section");
//     }
    
//     console.log("✅ Recent documents check completed");
    
//   } catch (error) {
//     console.warn(`⚠️ Recent documents check failed: ${error.message}`);
//   }
// }

// test('Login, then navigate dashboard with scrollbar for charts and recent documents', async ({ page }) => {
//   test.setTimeout(120000);

// // Step 1: Go to login page (ensure fresh start)
// await page.goto("https://ocr.techsavanna.technology/login");
// await page.waitForLoadState("networkidle");

// // Step 2: Enter email with visible typing
// console.log("📧 Typing email slowly...");

// const emailField = page.getByPlaceholder("Enter your email or username");
// await expect(emailField).toBeVisible({ timeout: 15000 });
// await emailField.click();
// await emailField.fill(""); // Clear field first
// await emailField.type("admin@ocrplatform.com", { delay: 150 }); // Simulate human typing

// // Step 3: Enter password with visible typing
// console.log("🔒 Typing password slowly...");

// const passwordField = page.getByPlaceholder("Enter your password");
// await expect(passwordField).toBeVisible({ timeout: 15000 });
// await passwordField.click();
// await passwordField.fill("");
// await passwordField.type("admin123", { delay: 150 });

// // Step 4: Click Sign In button (with visible pause)
//   console.log("Clicking Sign In button...");
//   const signInButton = page.getByRole('button', { name: /sign in/i });
//   await page.waitForTimeout(500); // short delay before click
//   await signInButton.click();

//  // Step 5: Wait for dashboard or success message
// console.log("⏳ Waiting for dashboard to load...");
// await page.waitForLoadState("networkidle", { timeout: 20000 })
  
// // Validate successful login
// await expect(page.locator("text=Dashboard")).toBeVisible({ timeout: 20000 });
// console.log("✅ Successfully logged in!");

//   // // Wait up to 10 seconds for the message to appear
//   // await expect(successMessage).toBeVisible({ timeout: 10000 });

//   // Navigate to dashboard
//   console.log("🏠 Navigating to dashboard...");
//   await page.goto('https://ocr.techsavanna.technology/dashboard');
//   await page.waitForLoadState('networkidle');
//   console.log("✅ Dashboard loaded successfully");

//   // === QUICK ACTION CARDS ===
//   const quickActions = [
//   { selector: "(//img[@loading='lazy'])[12]", name: "Upload Documents" },
//   { selector: "(//img[@loading='lazy'])[13]", name: "Manual Review" },
//   { selector: "(//div[@class='MuiBox-root css-10v1e3g'])[3]", name: "Pending Review" },
//   { selector: "(//img[@loading='lazy'])[15]", name: "Analytics" },
//   { selector: "(//img[@loading='lazy'])[16]", name: "User Management" },
//   { selector: "(//div[@class='MuiBox-root css-10v1e3g'])[6]", name: "System Settings" }
// ];

//   for (const action of quickActions) {
//     try {
//       console.log(`\n🖱️ Testing: ${action.name}`);
      
//       if (page.isClosed()) {
//         console.log("❌ Page was closed, cannot continue with quick actions");
//         break;
//       }

//       // Ensure we're on dashboard
//       const currentUrl = page.url();
//       if (!currentUrl.includes('/dashboard')) {
//         console.log("🔄 Currently not on dashboard, navigating back...");
//         await page.goto('https://ocr.techsavanna.technology/dashboard');
//         await page.waitForLoadState('networkidle');
//       }

//       console.log(`📍 Current URL: ${page.url()}`);
//       console.log(`👆 Clicking ${action.name}...`);

//       // Click with shorter timeout for System Settings
//       const clickTimeout = action.name === 'System Settings' ? 10000 : 15000;
      
//       await Promise.race([
//         page.locator(action.selector).click(),
//         new Promise(resolve => setTimeout(resolve, clickTimeout))
//       ]);

//       await page.waitForTimeout(2000);

//       const newUrl = page.url();
//       if (newUrl !== currentUrl) {
//         console.log(`📍 Navigated to: ${newUrl}`);
//       }

//       // For System Settings, use shorter timeout
//       if (action.name === 'System Settings') {
//         console.log("⚡ Using fast return for System Settings...");
//         await page.goto('https://ocr.techsavanna.technology/dashboard', { waitUntil: 'domcontentloaded' });
//       } else {
//         console.log("🔄 Returning to dashboard...");
//         await page.goto('https://ocr.techsavanna.technology/dashboard');
//         await page.waitForLoadState('networkidle');
//       }
      
//       console.log(`✅ Completed ${action.name}`);

//     } catch (error) {
//       console.warn(`⚠️ Action '${action.name}' failed: ${error.message}`);
      
//       if (!page.isClosed()) {
//         try {
//           await page.goto('https://ocr.techsavanna.technology/dashboard', { waitUntil: 'domcontentloaded' });
//           console.log("🔄 Recovered to dashboard after error");
//         } catch (recoveryError) {
//           console.error(`❌ Failed to recover: ${recoveryError.message}`);
//         }
//       }
//     }
//   }

//   // === CHART HOVER WITH SCROLLBAR ===
//   console.log("\n📈 Starting chart hover with scrollbar functionality...");
  
//   let shouldTestCharts = true;
  
//   if (page.isClosed()) {
//     console.log("📄 Page was closed, cannot test charts");
//     shouldTestCharts = false;
//   } else {
//     try {
//       if (!page.url().includes('/dashboard')) {
//         console.log("🔄 Navigating to dashboard for chart testing...");
//         await page.goto('https://ocr.techsavanna.technology/dashboard', { waitUntil: 'domcontentloaded' });
//       }
//     } catch (error) {
//       console.warn(`⚠️ Could not navigate to dashboard for charts: ${error.message}`);
//       shouldTestCharts = false;
//     }
//   }

//   if (shouldTestCharts) {
//     try {
//       // Perform chart hovering with scrollbar positioning
//       await hoverChartsWithScrollbar(page);
      
//       console.log("✅ Chart hover tests completed with scrollbar");

//     } catch (chartError) {
//       console.warn(`⚠️ Chart hover tests failed: ${chartError.message}`);
//     }
//   } else {
//     console.log("📄 Skipping chart hover tests - page unavailable");
//   }

//   // === RECENT DOCUMENTS CHECK WITH SCROLLBAR ===
//   console.log("\n📋 Starting recent documents check with scrollbar...");
  
//   if (page.isClosed()) {
//     console.log("📄 Page was closed, cannot check recent documents");
//   } else {
//     try {
//       // Ensure we're back on dashboard
//       if (!page.url().includes('/dashboard')) {
//         await page.goto('https://ocr.techsavanna.technology/dashboard', { waitUntil: 'domcontentloaded' });
//       }
      
//       // Check recent documents section
//       await checkRecentDocuments(page);
      
//       console.log("✅ Recent documents check completed");
      
//     } catch (docsError) {
//       console.warn(`⚠️ Recent documents check failed: ${docsError.message}`);
//     }
//   }

//   // Scroll back to top at the end
//   if (!page.isClosed()) {
//     await scrollToSection(page, 'top');
//     console.log("⬆️ Scrolled back to top");
//   }

//   console.log('\n🎯 Full test sequence completed with scrollbar functionality');
// });

import { test, expect } from '@playwright/test';

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
 * Main test: Login and dashboard navigation
 */
test('Login → Dashboard Navigation (Charts + Documents)', async ({ page }) => {
  test.setTimeout(120000);

  // === LOGIN ===
  console.log("🌐 Navigating to login page...");
  await page.goto("https://ocr.techsavanna.technology/login");
  await page.waitForLoadState("networkidle");

  const emailField = page.getByPlaceholder("Enter your email or username");
  const passwordField = page.getByPlaceholder("Enter your password");

  console.log("📧 Entering email...");
  await expect(emailField).toBeVisible();
  await emailField.fill("admin@ocrplatform.com");

  console.log("🔒 Entering password...");
  await expect(passwordField).toBeVisible();
  await passwordField.fill("admin123");

  console.log("🚪 Signing in...");
  const signInBtn = page.getByRole("button", { name: /sign in/i });
  await signInBtn.click();

  console.log("⏳ Waiting for dashboard to load...");
  await page.waitForLoadState("networkidle");
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

      // Wait for the target section or heading to load
      await page.waitForTimeout(3000);
      const sectionVisible = await page.locator(`text=${name}`).first().isVisible().catch(() => false);
      if (sectionVisible) {
        console.log(`✅ ${name} section loaded successfully!`);
      } else {
        console.log(`⚠️ ${name} section may not have loaded fully — check selector.`);
      }

      // Return to dashboard via Dashboard card
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
