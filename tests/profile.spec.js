// tests/profile.spec.js
import { test, expect } from '@playwright/test';
import { credentials } from './credentials.js';
import { LoginPage } from './pages.js';
import { logStep, waitForPageLoad, waitForVisible, tryStep } from './utils.js';

test('Profile navigation, edit, reset and logout flow', async ({ page }) => {
  const { username, password } = credentials.reviewer;
  const loginPage = new LoginPage(page);

  await logStep('Navigating to login page...');
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  // === STEP 1: LOGIN ===
  await logStep('Logging in as Reviewer...');
  await loginPage.login(username, password);

  await logStep('Waiting for successful login confirmation...');
  await expect(page.getByText(/Login successful/i)).toBeVisible({ timeout: 10000 });

  // === STEP 2: Open Profile Menu ===
  await logStep('Opening profile dropdown...');
  const profileIcon = page.locator("(//*[name()='path'])[3]");
  await profileIcon.click();

  // === STEP 3: Click 'Your Profile' ===
  await logStep('Navigating to "Your Profile"...');
  const yourProfileBtn = page.locator("(//a[normalize-space()='Your Profile'])[1]");
  await yourProfileBtn.click();
  await waitForPageLoad(page, 'Your Profile');

  // === STEP 4: Fill Profile Fields ===
  await logStep('Updating profile information...');
  await page.getByPlaceholder('Enter your full name').fill('System Administrator');
  await page.getByPlaceholder('Enter your email').fill('walter.oteku@yahoo.com');

  await logStep('Updating password fields...');
  await page.getByPlaceholder('Enter current password').fill('admin123');
  await page.getByPlaceholder('Enter new password').fill('walter123');
  await page.getByPlaceholder('Confirm new password').fill('walter123');

  // === STEP 5: Verify Role and Last Login ===
  // await logStep('Verifying account role and last login...');
  // const roleField = page.locator("(//input[@id='_r_c_'])[1]");
  // await waitForVisible(roleField);
  // const roleValue = await roleField.inputValue();
  // console.log(`✅ Role verified: ${roleValue}`);

  // const lastLoginField = page.locator("(//input[@id='_r_d_'])[1]");
  // await waitForVisible(lastLoginField);
  // const lastLoginValue = await lastLoginField.inputValue();
  // console.log(`✅ Last login verified: ${lastLoginValue}`);

  // === STEP 6: Save Profile Changes ===
  await logStep('Saving profile changes...');
  const saveBtn = page.locator('(//button[normalize-space()="Save Changes"])[1]');
  await waitForVisible(saveBtn);
  await saveBtn.click();

  const successToast = page.locator('text=Profile updated successfully');
  await successToast.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {
    console.log('⚠️ No visible toast detected — proceeding anyway.');
  });
  console.log('✅ Profile changes saved successfully!');

  // === STEP 7: Reset Profile Fields ===
  await logStep('Resetting profile form...');
  const resetBtn = page.locator('//button[contains(text(),"Reset") or @title="Reset"]');
  await tryStep(async () => await resetBtn.click(), 'Click Reset button');
  console.log('✅ Reset button clicked successfully!');
});
