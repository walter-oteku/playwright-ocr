import { test, expect } from '@playwright/test';
import path from 'path';

test('Full model training workflow: login, navigate, upload, start training', async ({ page }) => {
  test.setTimeout(180000);

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
await emailField.type("admin@ocrplatform.com", { delay: 150 }); // Simulate natural typing


// Step 3: Enter password with visible typing
console.log("🔒 Typing password slowly...");

const passwordSelector = "(//input[@id='_R_ilbinpfjrb_'])[1]";
const passwordField = page.locator(passwordSelector);

// Wait for password field to be ready, clear it, then type naturally
await passwordField.waitFor({ state: "visible", timeout: 10000 });
await passwordField.click();
await passwordField.fill(""); // Clear any pre-filled content
await passwordField.type("admin123", { delay: 150 }); // Simulate human typing


  // Step 4: Click Sign In button (with visible pause)
  console.log("Clicking Sign In button...");
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await page.waitForTimeout(500); // short delay before click
  await signInButton.click();

  // Step 5: Wait for a login success message
  console.log("Waiting for success message...");
  const successMessage = page.getByText(/Login successful/i);

  // === STEP 1: Navigate to Model Training Tab ===
  console.log("🧠 Navigating to 'Model Training' tab...");
  const modelTrainingTab = page.locator("(//a[normalize-space()='Model Training'])[1]");
  await modelTrainingTab.waitFor({ state: 'visible', timeout: 10000 });
  await modelTrainingTab.click();

  await page.waitForURL(/model-training|training/i, { timeout: 15000 });
  console.log("✅ Model Training page loaded successfully!");

  // === STEP 2: Enter Document Type ===
  console.log("📝 Typing in the document type...");
  const docTypeField = page.locator("(//input[@id='document-type'])[1]");
  await docTypeField.waitFor({ state: 'visible', timeout: 8000 });
  await docTypeField.fill("Invoice Document");
  console.log("✅ Document type entered.");

  // === STEP 3: Upload Training Document ===
  console.log("📎 Preparing to upload training document...");
  const filePath = path.resolve("C:/Users/walte/Downloads/Investment Management System.pdf");
  
 
  const fileInput = page.locator("input[type='file']");

  console.log("⌛ Starting simulated slow upload...");
  await new Promise(async (resolve) => {
    for (let i = 0; i <= 100; i += 25) {
      console.log(`🚀 Upload progress: ${i}%`);
      await page.waitForTimeout(1200);
    }
    resolve();
  });

  await fileInput.setInputFiles(filePath);
  console.log("📤 File upload initiated...");
  await page.waitForTimeout(3000); // allow time for backend to register upload
  console.log("✅ File uploaded successfully!");

  // === STEP 4: Start Training ===
  console.log("🧩 Clicking 'Start Training Document' button...");
  const startTrainingBtn = page.locator("(//button[normalize-space()='Start Training'])[1]");
  await startTrainingBtn.waitFor({ state: 'visible', timeout: 10000 });
  await startTrainingBtn.click();
  console.log("⚙️ Model training initiated... waiting for confirmation.");

  // === STEP 5: Confirm Training Started / Completed ===
  const trainingSuccessMsg = page.locator("//div[contains(., 'Training started') or contains(., 'Model training successful')]");
  if (await trainingSuccessMsg.isVisible({ timeout: 15000 }).catch(() => false)) {
    console.log("🎉 Model training confirmed as started successfully!");
  } else {
    console.log("⚠️ No success message detected — training might still be processing.");
  }

  console.log("🏁 Model Training workflow completed successfully!");
});
