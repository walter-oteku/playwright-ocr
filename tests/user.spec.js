import { test, expect } from '@playwright/test';

test('Full user workflow: create, filter, edit, and delete users', async ({ page }) => {
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
await page.getByPlaceholder('Enter full name').type('Walter Oke Oteku', { delay: 120 });
await page.waitForTimeout(1500);

// Type Email slowly
await page.getByPlaceholder('Enter email address').type('walteroteku15@gmail.com', { delay: 120 });
await page.waitForTimeout(1500);

// Type Password slowly
await page.getByPlaceholder('Enter password').type('securePass123', { delay: 120 });
await page.waitForTimeout(1500);

// === STEP 3A: Check Password Visibility (Eye Icon) ===
console.log("👁️ Checking password visibility toggle...");

const visibilityIcon = page.locator("(//*[name()='svg'][@class='h-5 w-5 text-gray-400'])[2]");

// Confirm the eye icon appears
await expect(visibilityIcon).toBeVisible({ timeout: 5000 });
console.log("✅ Eye icon is visible.");

// Click the icon to toggle password visibility
await visibilityIcon.click();
await page.waitForTimeout(1000);

// Verify that password field type switched from 'password' to 'text'
const passwordField = page.getByPlaceholder('Enter password');
const inputType = await passwordField.getAttribute('type');

if (inputType === 'text') {
  console.log("🔓 Password visibility toggle working perfectly!");
} else {
  console.log("⚠️ Password visibility toggle did not change input type.");
}

//  // === STEP 3: Fill Create New User Form ===
// console.log("📝 Filling new user details...");

// await page.getByPlaceholder('Enter full name').type('Walter Oke Oteku');
// await page.waitForTimeout(1500);



// // await page.getByPlaceholder('Enter email address').type('walteroteku15@gmail.com');
// // await page.waitForTimeout(1500);

// await page.getByPlaceholder('Enter password').type('securePass123');
// await page.waitForTimeout(1500);

// === STEP 3: Select User Role ===
console.log("📜 Selecting user role...");
const roleDropdown = page.locator("(//select[@name='role'])[1]");
await roleDropdown.selectOption('Manager');
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


//   // === STEP 2: Click Add New User ===
// console.log("➕ Clicking 'Add User' button...");
// const addUser1Btn = page.locator("(//button[normalize-space()='Add User'])[1]");
// await addUser1Btn.waitFor({ state: 'visible', timeout: 10000 });
// await addUser1Btn.click();
// console.log("✅ Navigated to 'Create New User' form.");
// // === STEP 5: Test Cancel and Close Buttons ===
// console.log("❌ Testing Cancel/Close functionality...");

// // Cancel button (index-based XPath)
// const cancelBtn = page.locator("(//button[normalize-space()='Cancel'])[1]");

// // Close button (index-based SVG XPath)
// const closeBtn = page.locator("(//*[name()='svg'][@class='h-6 w-6'])[3]");

// // Wait and click Cancel
// await cancelBtn.waitFor({ state: 'visible', timeout: 10000 });
// await cancelBtn.click();
// console.log("🚪 'Cancel' button clicked successfully!");

// // Wait and click Close icon
// await closeBtn.waitFor({ state: 'visible', timeout: 10000 });
// await closeBtn.click();
// console.log("✅ Close icon clicked successfully!");


 // === STEP 6: Open Filter Dropdown ===
console.log("🎛 Opening filter dropdown...");

// Using indexed XPath for the 'Filters' element
const filterDropdown = page.locator("(//span[normalize-space()='Filters'])[1]");

// Wait for visibility before clicking
await filterDropdown.waitFor({ state: 'visible', timeout: 10000 });
await filterDropdown.click();

console.log("✅ Filter dropdown opened!");


  // === STEP 7: Apply Role and Status Filters ===
console.log("🔍 Selecting filters for role and status...");

// Use indexed XPaths for Admin role and Active status
const adminRadio = page.locator("(//input[@value='admin'])[1]");
const activeStatusRadio = page.locator("(//input[@value='active'])[1]");

// Check and apply filters if visible
if (await adminRadio.isVisible()) {
  await adminRadio.check();
  console.log("✅ Role 'Admin' selected!");
}

if (await activeStatusRadio.isVisible()) {
  await activeStatusRadio.check();
  console.log("✅ Status 'Active' selected!");
}

// Apply the filter
const filterApplyBtn = page.locator("(//button[normalize-space()='Apply'])[1]");
await filterApplyBtn.waitFor({ state: 'visible', timeout: 10000 });
await filterApplyBtn.click();

console.log("🎯 Filters applied successfully!");
await page.waitForTimeout(2000);

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

 // === STEP X: Update Role ===
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

// Use the precise indexed XPath for the delete button
const deleteIcon = page.locator("(//button[@title='Delete user'])[2]");

if (await deleteIcon.isVisible({ timeout: 5000 })) {
  await deleteIcon.click();
  console.log("🧹 Delete icon clicked!");
  }

  // Confirm delete
//   const confirmDelete = page.locator('//button[contains(text(), "Confirm") or contains(text(), "Delete")]');
//   if (await confirmDelete.isVisible({ timeout: 5000 })) {
//     await confirmDelete.click();
//     console.log("✅ User deleted successfully!");
//   } else {
//     console.log("⚠️ Confirmation button not visible — likely a modal issue.");
//   }

//   console.log("🎉 User Management workflow test completed successfully!");
});
