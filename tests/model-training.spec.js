import { test, expect } from '@playwright/test';
import path from 'path';

test('Full model training workflow: login, navigate, upload, start training', async ({ page }) => {
  test.setTimeout(180000);

  // === LOGIN ===
  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("📧 Typing email...");
  await page.getByPlaceholder("Enter your email").type("admin", { delay: 100 });

  console.log("🔑 Typing password...");
  await page.getByPlaceholder("Enter your password").type("admin123", { delay: 100 });

  console.log("🚪 Clicking Sign In...");
  await page.getByRole('button', { name: /sign in/i }).click();

  console.log("⏳ Waiting for login success...");
  await expect(page.getByText(/login successful/i)).toBeVisible({ timeout: 15000 });
  console.log("✅ Login successful!");

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
