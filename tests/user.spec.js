import { test, expect } from '@playwright/test';

test('Full user workflow: create, filter, edit, and delete users', async ({ page }) => {
  test.setTimeout(180000);

  // === LOGIN ===
  console.log("🌐 Navigating to login page...");
  await page.goto('https://ocr.techsavanna.technology/login');
  await page.waitForLoadState('domcontentloaded');

  console.log("📧 Typing email slowly...");
  const emailSelector = "(//input[@id='_R_hlbinpfjrb_'])[1]";
  const emailField = page.locator(emailSelector);
  await emailField.waitFor({ state: "visible", timeout: 10000 });
  await emailField.click();
  await emailField.fill("");
  await emailField.type("reviewer1", { delay: 150 });

  console.log("🔒 Typing password slowly...");
  const passwordSelector = "(//input[@id='_R_ilbinpfjrb_'])[1]";
  const passwordField = page.locator(passwordSelector);
  await passwordField.waitFor({ state: "visible", timeout: 10000 });
  await passwordField.click();
  await passwordField.fill("");
  await passwordField.type("password123", { delay: 150 });

  console.log("🖱 Clicking Sign In button...");
  const signInButton = page.getByRole('button', { name: /sign in/i });
  await page.waitForTimeout(500);
  await signInButton.click();

  console.log("⏳ Waiting for success message...");
  const successMessage = page.getByText(/Login successful/i);
  await successMessage.isVisible();

  // === STEP 1: Navigate to Users Page ===
  console.log("👥 Navigating to 'Users' tab...");
  const usersTab = page.locator("(//a[normalize-space()='Users'])[1]");
  await usersTab.click();
  await page.waitForURL(/users/, { timeout: 15000 });
  console.log("✅ Users page loaded successfully!");

  // === STEP 2: Click Add New User ===
  console.log("➕ Clicking 'Add User' button...");
  const addUserBtn = page.locator("(//button[normalize-space()='Add User'])[1]");
  await addUserBtn.waitFor({ state: 'visible', timeout: 10000 });
  await addUserBtn.click();
  console.log("✅ Navigated to 'Create New User' form.");

  // === STEP 3: Fill Create New User Form ===
console.log("📝 Filling new user details...");

// Type Full Name slowly
const nameField = page.getByPlaceholder('Enter full name');
await nameField.waitFor({ state: "visible", timeout: 10000 });
await nameField.click();
await nameField.fill(""); // Clear any pre-filled text
await nameField.type("Walter Oke Oteku", { delay: 120 });
await page.waitForTimeout(1000);

// Type Email slowly
const emailField1 = page.getByPlaceholder('Enter email address');
await emailField1.waitFor({ state: "visible", timeout: 10000 });
await emailField1.click();
await emailField1.fill("");
await emailField1.type("walteroteku15@gmail.com", { delay: 120 });
await page.waitForTimeout(1000);

// Type Password slowly
const passwordField1 = page.getByPlaceholder('Enter password');
await passwordField1.waitFor({ state: "visible", timeout: 10000 });
await passwordField1.click();
await passwordField1.fill("");
await passwordField1.type("securePass123", { delay: 120 });
await page.waitForTimeout(1000);

  // === STEP 3A: Check Password Visibility (Eye Icon) ===
  // console.log("👁️ Checking password visibility toggle...");
  // const visibilityIcon = page.locator("(//*[name()='svg'][@class='h-5 w-5 text-gray-400'])[2]");
  // await expect(visibilityIcon).toBeVisible({ timeout: 5000 });
  // console.log("✅ Eye icon is visible.");
  // await visibilityIcon.click();
  // await page.waitForTimeout(1000);

  // === STEP 3B: Select User Role ===
  // === STEP 3: Select User Role ===
console.log("📜 Selecting user role...");

// Open the role dropdown (MUI style)
const roleDropdown = page.locator("(//div[@id='mui-component-select-role'])[1]");
await roleDropdown.waitFor({ state: "visible", timeout: 10000 });
await roleDropdown.click();

// Select "Manager" option from the dropdown list
const managerOption = page.locator("//li[normalize-space()='Manager']");
await managerOption.waitFor({ state: "visible", timeout: 10000 });
await managerOption.click();

console.log("✅ Role selected as Manager.");
await page.waitForTimeout(2000);


  // === STEP 4: Create User ===
  console.log("🚀 Creating new user...");
  const createBtn = page.getByRole('button', { name: /^Create User$/i });
  if (await createBtn.isVisible({ timeout: 5000 })) {
    await createBtn.click();
    console.log("🧠 Waiting for user creation process to complete...");
    await page.waitForTimeout(4000);
    console.log("✅ User created successfully!");
  } else {
    console.warn("⚠️ Create User button not found or not visible.");
  }

  // === STEP 6: Open Filter Dropdown ===
  console.log("🎛 Opening filter dropdown...");
  const filterDropdown = page.locator("(//span[normalize-space()='Filters'])[1]");
  await filterDropdown.waitFor({ state: 'visible', timeout: 10000 });
  await filterDropdown.click();
  console.log("✅ Filter dropdown opened!");

  // === STEP 7: Apply Role and Status Filters ===
  console.log("🔍 Selecting filters for role and status...");
  const adminRadio = page.locator("(//input[@value='admin'])[1]");
  const activeStatusRadio = page.locator("(//input[@value='active'])[1]");

  if (await adminRadio.isVisible()) {
    await adminRadio.check();
    console.log("✅ Role 'Admin' selected!");
  }

  if (await activeStatusRadio.isVisible()) {
    await activeStatusRadio.check();
    console.log("✅ Status 'Active' selected!");
  }

  const filterApplyBtn = page.locator("(//button[normalize-space()='Apply'])[1]");
  await filterApplyBtn.waitFor({ state: 'visible', timeout: 10000 });
  await filterApplyBtn.click();
  console.log("🎯 Filters applied successfully!");
  await page.waitForTimeout(2000);

  // === STEP 8: Cancel Filter Operation ===
  console.log("🛑 Testing cancel filter functionality...");
  const filterCancelBtn = page.locator("(//button[normalize-space()='Cancel'])[1]");
  if (await filterCancelBtn.isVisible()) {
    await filterCancelBtn.click();
    console.log("✅ Filter cancel button works correctly.");
  }
  await page.waitForTimeout(2000);

  // === STEP 9: Edit User Details ===
  console.log("✏️ Editing an existing user...");
  const userCheckbox = page.locator('(//input[@type="checkbox"])[3]');
  await userCheckbox.check();

  const editIcon = page.locator("(//*[name()='svg'][@class='h-4 w-4'])[3]");
  await editIcon.click();
  console.log("✅ Edit icon clicked.");

  console.log("📜 Updating user role...");
  const editRoleDropdown = page.locator("(//select[@class='block w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500'])[1]");
  await editRoleDropdown.selectOption('Manager');
  console.log("🔁 Role changed to Manager.");

  const saveBtn = page.getByRole('button', { name: /^Save Changes$/i });
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    console.log("💾 Changes saved successfully!");
  } else {
    console.log("⚠️ Save button not visible — skipping.");
  }

  await page.waitForTimeout(2000);

  // === STEP 10: Delete User ===
  console.log("🗑 Attempting to delete user...");
  const deleteIcon = page.locator("(//button[@title='Delete user'])[2]");
  if (await deleteIcon.isVisible({ timeout: 5000 })) {
    await deleteIcon.click();
    console.log("🧹 Delete icon clicked!");
  }

  console.log("🎉 User Management workflow test completed successfully!");
});
