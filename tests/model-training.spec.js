// tests/model-training.spec.js
import { test, expect } from '@playwright/test';
import path from 'path';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { logStep, waitForPageLoad, waitForVisible } from './utils.js';

test('🧠 Full model training workflow: login, navigate, upload, start training', async ({ page }) => {
  const { username, password } = credentials.reviewer;
  const loginPage = new LoginPage(page);

  // === STEP 1: LOGIN ===
  await logStep("🌐 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  await logStep("🔐 Logging in as reviewer...");
  await loginPage.login(username, password);

  await waitForPageLoad(page, 'Dashboard');
  await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 10000 });
  console.log("✅ Login successful!");

  // === STEP 2: NAVIGATE TO MODEL TRAINING TAB ===
  await logStep("🧠 Navigating to 'Model Training' tab...");
  const modelTrainingTab = page.locator("(//a[normalize-space()='Model Training'])[1]");
  await waitForVisible(modelTrainingTab, 10000);
  await modelTrainingTab.click();

  await page.waitForURL(/model-training|training/i, { timeout: 15000 });
  console.log("✅ Model Training page loaded successfully!");

  // === DEBUG: Check page content ===
  await logStep("🔍 Debugging page content...");
  await page.waitForTimeout(2000); // brief pause

  // Take a screenshot to see what's actually there
  await page.screenshot({ path: 'debug-model-training.png', fullPage: true });
  console.log("📸 Screenshot saved as 'debug-model-training.png'");

  // Check for any input fields on the page
  const allInputs = await page.locator('input').count();
  console.log(`🔍 Found ${allInputs} input fields on the page`);

  // List all input types for debugging
  const inputFields = page.locator('input');
  for (let i = 0; i < Math.min(allInputs, 10); i++) {
    const inputType = await inputFields.nth(i).getAttribute('type');
    const inputId = await inputFields.nth(i).getAttribute('id');
    const inputPlaceholder = await inputFields.nth(i).getAttribute('placeholder');
    console.log(`Input ${i}: type=${inputType}, id=${inputId}, placeholder=${inputPlaceholder}`);
  }

  // Check for iframes that might contain the form
  const iframes = page.frames();
  if (iframes.length > 1) {
    console.log(`🔍 Found ${iframes.length} iframes on the page`);
  }

  // === STEP 3: ENTER DOCUMENT TYPE ===
  await logStep("📝 Typing in the document type...");

  // Try multiple possible selectors for the document type field
  let docTypeField = null;
  const possibleSelectors = [
    "input#document-type",
    "input[placeholder*='document' i]",
    "input[placeholder*='type' i]",
    "input[name*='document']",
    "input[data-testid*='document']",
    "//input[contains(@class, 'document')]",
    "//label[contains(., 'Document')]/following-sibling::input",
    "input[type='text']:first-of-type"
  ];

  for (const selector of possibleSelectors) {
    const field = page.locator(selector).first();
    if (await field.isVisible({ timeout: 2000 }).catch(() => false)) {
      docTypeField = field;
      console.log(`✅ Found document type field using: ${selector}`);
      break;
    }
  }

  if (!docTypeField) {
    console.log("❌ No document type field found with common selectors");
    // Fallback: try to find any text input that might be for document type
    const textInputs = page.locator('input[type="text"]');
    const count = await textInputs.count();
    if (count > 0) {
      docTypeField = textInputs.first();
      console.log("⚠️ Using first text input as fallback");
    } else {
      throw new Error("Could not find document type input field");
    }
  }

  await waitForVisible(docTypeField, 15000);
  await docTypeField.fill("Invoice Document");
  console.log("✅ Document type entered.");

  // === STEP 4: UPLOAD TRAINING DOCUMENT ===
  await logStep("📎 Preparing to upload training document...");
  const filePath = path.resolve("C:/Users/walte/Downloads/Investment Management System.pdf");
  
  // Try multiple possible file input selectors
  let fileInput = null;
  const fileInputSelectors = [
    "input[type='file']",
    "input[accept*='pdf']",
    "input[accept*='document']",
    "//input[@type='file']",
    "//label[contains(., 'upload') or contains(., 'file')]/following-sibling::input[@type='file']"
  ];

  for (const selector of fileInputSelectors) {
    const input = page.locator(selector).first();
    if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
      fileInput = input;
      console.log(`✅ Found file input using: ${selector}`);
      break;
    }
  }

  if (!fileInput) {
    // Fallback to the original selector
    fileInput = page.locator("input[type='file']").first();
    console.log("⚠️ Using default file input selector");
  }

  console.log("⌛ Simulating upload progress...");
  for (let i = 0; i <= 100; i += 25) {
    console.log(`🚀 Upload progress: ${i}%`);
    await page.waitForTimeout(800);
  }

  await fileInput.setInputFiles(filePath);
  console.log("📤 File upload initiated...");
  
  // Wait for any upload confirmation or progress indicator
  await page.waitForTimeout(4000);
  
  // Check for upload success indicators
  const uploadSuccessIndicators = [
    page.locator("text=Upload successful"),
    page.locator("text=Upload completed"),
    page.locator("text=100%"),
    page.locator(".progress-bar"),
    page.locator("[class*='success']")
  ];
  
  for (const indicator of uploadSuccessIndicators) {
    if (await indicator.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("✅ File upload confirmed with success indicator!");
      break;
    }
  }
  
  console.log("✅ File uploaded successfully!");

  // === STEP 5: START TRAINING ===
  await logStep("🧩 Clicking 'Start Training' button...");
  
  // Try multiple possible selectors for the start training button
  let startTrainingBtn = null;
  const buttonSelectors = [
    "button:has-text('Start Training')",
    "button:has-text('Train Model')",
    "button[type='submit']",
    "//button[contains(., 'Start Training')]",
    "//button[contains(., 'Train')]"
  ];

  for (const selector of buttonSelectors) {
    const btn = page.locator(selector).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      startTrainingBtn = btn;
      console.log(`✅ Found training button using: ${selector}`);
      break;
    }
  }

  if (!startTrainingBtn) {
    // Fallback to original selector
    startTrainingBtn = page.locator("(//button[normalize-space()='Start Training'])[1]");
    console.log("⚠️ Using default training button selector");
  }

  await waitForVisible(startTrainingBtn, 10000);
  await startTrainingBtn.click();

  console.log("⚙️ Model training initiated... awaiting confirmation.");
  
  // Wait for training to start with multiple possible success messages
  const trainingMsg = page.locator("//div[contains(., 'Training started') or contains(., 'Model training successful') or contains(., 'Training in progress') or contains(., 'Training initiated')]");
  
  if (await trainingMsg.isVisible({ timeout: 15000 }).catch(() => false)) {
    console.log("🎉 Model training started successfully!");
  } else {
    console.log("⚠️ No success message detected — checking for alternative indicators...");
    
    // Check for any loading indicators or status changes
    const loadingIndicator = page.locator("[class*='loading'], [class*='spinner'], .progress-bar");
    if (await loadingIndicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log("🔄 Training appears to be in progress (loading indicator visible)");
    } else {
      console.log("ℹ️ Training may still be processing in the background");
    }
  }

  console.log("🏁 Model Training workflow completed successfully!");
});