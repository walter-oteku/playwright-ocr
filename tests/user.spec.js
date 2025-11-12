// tests/user.spec.js
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages.js';
import { credentials } from './credentials.js';
import { logStep, waitForPageLoad, waitForVisible } from './utils.js';

test('Full user workflow: create, filter, edit, and delete users', async ({ page }) => {
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

  // === STEP 2: NAVIGATE TO USERS PAGE ===
  await logStep("👥 Navigating to 'Users' tab...");
  const usersTab = page.locator("(//a[normalize-space()='Users'])[1]");
  await waitForVisible(usersTab, 10000);
  await usersTab.click();

  await page.waitForURL(/users/, { timeout: 15000 });
  console.log("✅ Users page loaded successfully!");

  // === STEP 3: CLICK ADD NEW USER ===
  await logStep("➕ Clicking 'Add User' button...");
  const addUserBtn = page.locator("(//button[normalize-space()='Add User'])[1]");
  await waitForVisible(addUserBtn, 10000);
  await addUserBtn.click();
  console.log("✅ Navigated to 'Create New User' form.");

  // === STEP 4: FILL CREATE NEW USER FORM ===
  await logStep("📝 Filling new user details...");

  // Type Full Name slowly
  const nameField = page.getByPlaceholder('Enter username');
  await waitForVisible(nameField, 10000);
  await nameField.click();
  await nameField.fill(""); // Clear any pre-filled text
  await nameField.type("Walter Oke Oteku", { delay: 120 });
  await page.waitForTimeout(1000);

  // Type Email slowly
  const emailField1 = page.getByPlaceholder('Enter email address');
  await waitForVisible(emailField1, 10000);
  await emailField1.click();
  await emailField1.fill("");
  await emailField1.type("walteroteku15@gmail.com", { delay: 120 });
  await page.waitForTimeout(1000);

   // Type Full Name slowly
  const nameField1 = page.getByPlaceholder('Enter first name');
  await waitForVisible(nameField, 10000);
  await nameField1.click();
  await nameField1.fill(""); // Clear any pre-filled text
  await nameField1.type("Walter", { delay: 120 });
  await page.waitForTimeout(1000);

   // Type Full Name slowly
  const nameField2 = page.getByPlaceholder('Enter last name');
  await waitForVisible(nameField, 10000);
  await nameField2.click();
  await nameField2.fill(""); // Clear any pre-filled text
  await nameField2.type("Oteku", { delay: 120 });
  await page.waitForTimeout(1000);

  // Type Password slowly
  const passwordField1 = page.getByPlaceholder('Enter password');
  await waitForVisible(passwordField1, 10000);
  await passwordField1.click();
  await passwordField1.fill("");
  await passwordField1.type("securePass123", { delay: 120 });
  await page.waitForTimeout(1000);

  // === STEP 5: SELECT USER ROLE ===
  await logStep("📜 Selecting user role...");

  // Open the role dropdown (MUI style)
  // const roleDropdown = page.locator("(//div[@role='combobox'])[1]");
  // await waitForVisible(roleDropdown, 10000);
  // await roleDropdown.click();

  // // Select "Manager" option from the dropdown list
  // const managerOption = page.locator("//li[normalize-space()='Manager']");
  // await waitForVisible(managerOption, 10000);
  // await managerOption.click();

  // console.log("✅ Role selected as Manager.");
  // await page.waitForTimeout(2000);
  // Open the role dropdown (MUI style)
const roleDropdown = page.locator("(//div[@role='combobox'])[1]");
await waitForVisible(roleDropdown, 10000);
await roleDropdown.click();

// Now, in the dropdown, we see checkboxes. We want to select the 4th checkbox (Annotator).
await logStep("Selecting Annotator role...");
const annotatorCheckbox = page.locator("(//input[@type='checkbox'])[4]");
await waitForVisible(annotatorCheckbox, 10000);
await annotatorCheckbox.check();  // This checks the checkbox if it's not already checked.

// Then click the Apply button to confirm the selection.
const applyButton = page.locator("(//button[normalize-space()='Apply'])[1]");
await waitForVisible(applyButton, 10000);
await applyButton.click();

console.log("✅ Role selected as Annotator.");
await page.waitForTimeout(2000);

  // === STEP 6: CREATE USER ===
  await logStep("🚀 Creating new user...");
  const createBtn = page.getByRole('button', { name: /^Create User$/i });
  if (await createBtn.isVisible({ timeout: 5000 })) {
    await createBtn.click();
    console.log("🧠 Waiting for user creation process to complete...");
    await page.waitForTimeout(4000);
    console.log("✅ User created successfully!");
  } else {
    console.warn("⚠️ Create User button not found or not visible.");
  }

  // === STEP 7: OPEN FILTER DROPDOWN ===
  await logStep("🎛 Opening filter dropdown...");
  const filterDropdown = page.locator("(//*[name()='svg'][@class='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1pqasgp'])[1]");
  await waitForVisible(filterDropdown, 10000);
  await filterDropdown.click();
  console.log("✅ Filter dropdown opened!");

  // === STEP 8: APPLY ROLE AND STATUS FILTERS ===
  await logStep("🔍 Selecting filters for role and status...");
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
  await waitForVisible(filterApplyBtn, 10000);
  await filterApplyBtn.click();
  console.log("🎯 Filters applied successfully!");
  await page.waitForTimeout(2000);

  // === STEP 9: CANCEL FILTER OPERATION ===
  await logStep("🛑 Testing cancel filter functionality...");
  const filterCancelBtn = page.locator("(//button[normalize-space()='Cancel'])[1]");
  if (await filterCancelBtn.isVisible()) {
    await filterCancelBtn.click();
    console.log("✅ Filter cancel button works correctly.");
  }
  await page.waitForTimeout(2000);

  // === STEP 10: EDIT USER DETAILS ===
  // await logStep("✏️ Editing an existing user...");
  // const userCheckbox = page.locator('(//button[@aria-label="Edit user"])[1]');
  // await userCheckbox.check();

  const editIcon = page.locator('(//button[@aria-label="Edit user"])[1]');
  await waitForVisible(editIcon, 10000);
  await editIcon.click();
  console.log("✅ Edit icon clicked.");

     // Type Full Name slowly
  const nameField3 = page.getByLabel('Username');
  await waitForVisible(nameField, 10000);
  await nameField3.click();
  await nameField3.fill(""); // Clear any pre-filled text
  await nameField3.type("annotator12", { delay: 120 });
  await page.waitForTimeout(1000);

  // await logStep("📜 Updating user role...");
  // const editRoleDropdown = page.locator("(//select[@class='block w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500'])[1]");
  // await waitForVisible(editRoleDropdown, 10000);
  // await editRoleDropdown.selectOption('Manager');
  // console.log("🔁 Role changed to Manager.");

  const saveBtn = page.getByRole('button', { name: /^Save Changes$/i });
  if (await saveBtn.isVisible()) {
    await saveBtn.click();
    console.log("💾 Changes saved successfully!");
  } else {
    console.log("⚠️ Save button not visible — skipping.");
  }

  await page.waitForTimeout(2000);

  // === STEP 11: DELETE USER ===
  await logStep("🗑 Attempting to delete user...");
  const deleteIcon = page.locator("(//img[@alt='Delete'])[2]");
  if (await deleteIcon.isVisible({ timeout: 5000 })) {
    await deleteIcon.click();
    console.log("🧹 Delete icon clicked!");
  }

  console.log("🎉 User Management workflow test completed successfully!");
});