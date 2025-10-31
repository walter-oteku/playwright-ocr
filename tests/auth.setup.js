import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  console.log('Starting authentication setup...');
  await page.goto('/login');
  await page.fill('input[placeholder="Enter your email"]', 'admin@example.com');
  await page.fill('input[placeholder="Enter your password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL(/documents|dashboard/);
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
  console.log('Authentication setup completed!');
});
