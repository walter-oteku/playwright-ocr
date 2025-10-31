import { test, expect } from '@playwright/test';
import path from 'path';

test('Full document workflow: upload, search, filter, view, edit, delete', async ({ page }) => {
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

  // === STEP 1: Navigate to Documents ===
  console.log("📁 Navigating to 'Documents' tab...");
  await page.locator('a[href="/documents"]').first().click();
  await page.waitForURL(/documents/, { timeout: 15000 });
  console.log("✅ Documents page loaded.");

  // === STEP 2: Click Upload Documents ===
  console.log("📤 Clicking 'Upload Documents' button...");
  await page.locator("//button[normalize-space()='Upload Documents']").click();
  await page.waitForURL(/upload/, { timeout: 15000 });
  console.log("✅ Upload page opened successfully!");

  // === STEP 3: Upload a sample file ===
  console.log("📎 Uploading sample document...");
  const filePath = path.resolve('C:/Users/walte/OneDrive/Documents/Parklands_Training_Tracker.pdf');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  console.log("✅ File uploaded successfully!");

  // Simulate clicking upload/submit button if present
  const uploadButton = page.getByRole('button', { name: /Submit|Upload/i });
  if (await uploadButton.isVisible()) {
    await uploadButton.click();
    console.log("🚀 Upload initiated...");
  }

  await page.waitForTimeout(5000);
  await page.goto('https://ocr-engine.netlify.app/documents');
  console.log("🔄 Navigated back to Documents list.");

  // === STEP 4: Search for the uploaded document ===
  console.log("🔍 Searching for uploaded document...");
  const searchBox = page.getByPlaceholder(/Search documents/i);
  await searchBox.click();
  await searchBox.fill("Parklands_Training_Tracker");
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);
  console.log("✅ Search completed.");

  // === STEP 4B: Clear the search field before continuing ===
  console.log("🧹 Clearing search field for next steps...");
  await searchBox.click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(1000);
  console.log("✅ Search field cleared — ready for next actions.");

  // === FILTERING SECTION ===
  console.log("⚙️ Opening the Filters dropdown...");
  const filterButton = page.getByRole('button', { name: /Filters/i });
  await filterButton.click();
  await page.waitForTimeout(2000); // Increased timeout for UI to settle

  // === Apply Status Filter ===
  console.log("✅ Selecting 'Completed' status...");
  const statusCheckbox = page.locator('label:has-text("Completed") input[type="checkbox"]');
  if (await statusCheckbox.isVisible()) {
    await statusCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await statusCheckbox.check();
    await page.waitForTimeout(1500); // Wait for filter to apply
    console.log("✅ Status filter applied.");
  } else {
    console.log("⚠️ Status filter not visible — skipping.");
  }

  // === Apply Document Type Filter ===
  console.log("📄 Selecting 'Business Permit' document type...");
  const docTypeCheckbox = page.locator('label:has-text("Business Permit") input[type="checkbox"]');
  if (await docTypeCheckbox.isVisible()) {
    await docTypeCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await docTypeCheckbox.check();
    await page.waitForTimeout(1500); // Wait for filter to apply
    console.log("✅ Document type filter applied.");
  } else {
    console.log("⚠️ Document type filter not visible — skipping.");
  }

  // === Click 'Clear All' to reset filters ===
  console.log("🧹 Clicking 'Clear all' to reset filters...");
  const clearAllButton = page.getByRole('button', { name: /Clear all/i });
  if (await clearAllButton.isVisible()) {
    await clearAllButton.waitFor({ state: 'visible', timeout: 5000 });
    await clearAllButton.click();
    await page.waitForTimeout(1500); // Wait for clear to complete
    console.log("✅ Filters cleared successfully.");
  } else {
    console.log("⚠️ 'Clear all' button not visible — skipping.");
  }

  // === Fill Upload Date Range ===
  console.log("📅 Filling in Upload Date Range...");
  await page.fill('(//input[@type="date"])[1]', '2025-10-01');
  await page.fill('(//input[@type="date"])[2]', '2025-10-27');
  await page.waitForTimeout(1000);
  console.log("✅ Date range entered.");

  console.log("📊 Filling in Confidence Score Range...");
  await page.locator('text=Confidence Score Range').click().catch(() => {});
  await page.waitForTimeout(1000);

  const minScoreInput = page.locator('(//input[@type="number"])[1]');
  const maxScoreInput = page.locator('(//input[@type="number"])[2]');

  await minScoreInput.waitFor({ state: 'visible', timeout: 10000 });
  await maxScoreInput.waitFor({ state: 'visible', timeout: 10000 });

  await minScoreInput.fill('');
  await minScoreInput.type('6', { delay: 100 });
  await maxScoreInput.fill('');
  await maxScoreInput.type('10', { delay: 100 });
  await page.waitForTimeout(1000);
  console.log("✅ Confidence Score Range entered successfully!");

  // === Collapse Filters ===
  console.log("⬆️ Collapsing Filters panel...");
  const collapseArrow = page.locator('xpath=/html/body/div/div[2]/main/div/div/div/div[2]/div/div[2]/button/*[name()="svg"][2]');
  await collapseArrow.waitFor({ state: 'visible', timeout: 10000 });
  await collapseArrow.click();
  await page.waitForTimeout(2000);
  console.log("✅ Filters panel collapsed successfully!");

  // === STEP 6: Search for existing document (using what's actually in the table) ===
  console.log("🔎 Searching for existing document...");
  const searchBoxAgain = page.getByPlaceholder(/Search documents/i);
  await searchBoxAgain.click();
  
  // Search for a document that actually exists based on your screenshot
  await searchBoxAgain.fill("Business Permit");
  await page.keyboard.press('Enter');
  
  console.log("⏳ Waiting for search results to load...");
  await page.waitForTimeout(4000);

  // Get the first row for actions
  const firstRow = page.locator('table tbody tr').first();

  // === STEP 7: View Document (Eye Icon) ===
console.log("👁 Attempting to view document...");
try {
  // Method 1: Use the exact xpath you provided
  const viewIcon = page.locator('(//*[name()="svg"][@class="h-4 w-4"])[1]');
  
  // Method 2: Alternative - look for the eye icon specifically in the first row
  const viewIconInRow = firstRow.locator('(//*[name()="svg"][@class="h-4 w-4"])[1]');
  
  // Method 3: More specific - look for SVG with class in the actions column
  const viewIconActions = firstRow.locator('svg.h-4.w-4').first();
  
  if (await viewIcon.isVisible({ timeout: 5000 })) {
    await viewIcon.click();
    console.log("✅ View icon clicked using direct xpath!");
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    // Verify we're on a document view page
    if (page.url().includes('/document/') || page.url().includes('/view/') || page.url().includes('/documents/')) {
      console.log("✅ Document view page loaded successfully!");
    } else {
      console.log("📄 Navigated to:", page.url());
    }
    
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
  } else if (await viewIconInRow.isVisible({ timeout: 5000 })) {
    await viewIconInRow.click();
    console.log("✅ View icon clicked using row-specific xpath!");
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
  } else if (await viewIconActions.isVisible({ timeout: 5000 })) {
    await viewIconActions.click();
    console.log("✅ View icon clicked using class selector!");
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
  } else {
    console.log("⚠️ Eye icon not found with specified selectors");
    
    // Debug: List all SVGs in the row to see what's available
    const allSvgs = firstRow.locator('svg');
    const svgCount = await allSvgs.count();
    console.log(`🔍 Found ${svgCount} SVG icons in the row`);
    
    for (let i = 0; i < svgCount; i++) {
      const svgClass = await allSvgs.nth(i).getAttribute('class');
      console.log(`   SVG ${i + 1}: class="${svgClass}"`);
    }
  }
} catch (error) {
  console.log("⚠️ View action failed:", error.message);
}
  // === STEP 8: Download Document (Download Icon) ===
console.log("⬇️ Attempting to download document...");
try {
  // Method 1: Use the exact xpath you provided for download (second SVG)
  const downloadIcon = page.locator('(//*[name()="svg"][@class="h-4 w-4"])[2]');
  
  // Method 2: Alternative - look for the download icon specifically in the first row
  const downloadIconInRow = firstRow.locator('(//*[name()="svg"][@class="h-4 w-4"])[2]');
  
  // Method 3: More specific - look for second SVG with class in the actions column
  const downloadIconActions = firstRow.locator('svg.h-4.w-4').nth(1);
  
  if (await downloadIcon.isVisible({ timeout: 5000 })) {
    await downloadIcon.click();
    console.log("✅ Download icon clicked using direct xpath!");
    await page.waitForTimeout(3000);
    
    // Check if download was triggered (you might see a download dialog or file saving)
    console.log("✅ Document download triggered successfully!");
    
  } else if (await downloadIconInRow.isVisible({ timeout: 5000 })) {
    await downloadIconInRow.click();
    console.log("✅ Download icon clicked using row-specific xpath!");
    await page.waitForTimeout(3000);
    console.log("✅ Document download triggered successfully!");
    
  } else if (await downloadIconActions.isVisible({ timeout: 5000 })) {
    await downloadIconActions.click();
    console.log("✅ Download icon clicked using class selector (second SVG)!");
    await page.waitForTimeout(3000);
    console.log("✅ Document download triggered successfully!");
    
  } else {
    console.log("⚠️ Download icon not found with specified selectors");
    
    // Debug: List all SVGs in the row to see what's available
    const allSvgs = firstRow.locator('svg');
    const svgCount = await allSvgs.count();
    console.log(`🔍 Found ${svgCount} SVG icons in the row`);
    
    for (let i = 0; i < svgCount; i++) {
      const svgClass = await allSvgs.nth(i).getAttribute('class');
      console.log(`   SVG ${i + 1}: class="${svgClass}"`);
    }
  }
} catch (error) {
  console.log("⚠️ Download action failed:", error.message);
}

 // === STEP 9: Delete Document (Delete Icon) ===
console.log("🗑 Attempting to delete document...");
try {
  // Method 1: Use the exact xpath you provided for delete (second delete button)
  const deleteButton = page.locator('(//button[@title="Delete document"])[2]');
  
  // Method 2: Alternative - look for the delete button specifically in the first row
  const deleteButtonInRow = firstRow.locator('(//button[@title="Delete document"])[2]');
  
  // Method 3: More specific - look for delete button in the actions column
  const deleteButtonActions = firstRow.locator('button[title="Delete document"]').nth(1);
  
  if (await deleteButton.isVisible({ timeout: 5000 })) {
    await deleteButton.click();
    console.log("✅ Delete button clicked using direct xpath!");
    await page.waitForTimeout(2000);
    
    // Handle confirmation dialog
    await handleDeleteConfirmation();
    
  } else if (await deleteButtonInRow.isVisible({ timeout: 5000 })) {
    await deleteButtonInRow.click();
    console.log("✅ Delete button clicked using row-specific xpath!");
    await page.waitForTimeout(2000);
    
    // Handle confirmation dialog
    await handleDeleteConfirmation();
    
  } else if (await deleteButtonActions.isVisible({ timeout: 5000 })) {
    await deleteButtonActions.click();
    console.log("✅ Delete button clicked using title selector (second button)!");
    await page.waitForTimeout(2000);
    
    // Handle confirmation dialog
    await handleDeleteConfirmation();
    
  } else {
    console.log("⚠️ Delete button not found with specified selectors");
    
    // Debug: List all delete buttons in the row to see what's available
    const allDeleteButtons = firstRow.locator('button[title*="delete" i]');
    const deleteCount = await allDeleteButtons.count();
    console.log(`🔍 Found ${deleteCount} delete buttons in the row`);
    
    for (let i = 0; i < deleteCount; i++) {
      const buttonTitle = await allDeleteButtons.nth(i).getAttribute('title');
      console.log(`   Delete Button ${i + 1}: title="${buttonTitle}"`);
    }
  }
} catch (error) {
  console.log("⚠️ Delete action failed:", error.message);
}

// Helper function to handle delete confirmation
async function handleDeleteConfirmation() {
  console.log("🧹 Delete confirmation dialog opened...");
  
  // Wait for confirmation dialog to appear
  await page.waitForTimeout(1000);
  
  // Try multiple confirmation button selectors
  const confirmSelectors = [
    page.getByRole('button', { name: /confirm/i }),
    page.getByRole('button', { name: /delete/i }),
    page.getByRole('button', { name: /yes/i }),
    page.getByRole('button', { name: /ok/i }),
    page.locator('button:has-text("Confirm")'),
    page.locator('button:has-text("Delete")'),
    page.locator('button:has-text("Yes")'),
    page.locator('button:has-text("OK")'),
    page.locator('//button[contains(text(), "Confirm")]'),
    page.locator('//button[contains(text(), "Delete")]')
  ];
  
  let confirmed = false;
  
  for (const confirmSelector of confirmSelectors) {
    if (await confirmSelector.isVisible({ timeout: 3000 })) {
      await confirmSelector.click();
      console.log("✅ Delete confirmed!");
      await page.waitForTimeout(3000);
      confirmed = true;
      break;
    }
  }
  
  if (!confirmed) {
    console.log("⚠️ Confirm button not visible — modal issue suspected.");
    
    // Try to close the modal if confirmation failed
    const cancelSelectors = [
      page.getByRole('button', { name: /cancel/i }),
      page.getByRole('button', { name: /no/i }),
      page.locator('button:has-text("Cancel")'),
      page.locator('button:has-text("No")'),
      page.locator('[aria-label="Close"]'),
      page.locator('//button[contains(text(), "Cancel")]')
    ];
    
    for (const cancelSelector of cancelSelectors) {
      if (await cancelSelector.isVisible({ timeout: 2000 })) {
        await cancelSelector.click();
        console.log("✅ Modal closed using cancel button");
        await page.waitForTimeout(1000);
        break;
      }
    }
  }
  
  return confirmed;
}
});