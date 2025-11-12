// tests/pages.js
export class LoginPage {
  constructor(page) {
    this.page = page;

    // Updated locators based on the new XPaths you shared
    this.username = page.locator('(//input[@id="_R_1lbinpfjrb_"])[1]');
    this.password = page.locator('(//input[@id="_R_2lbinpfjrb_"])[1]');
    this.signInBtn = page.locator("(//button[normalize-space()='Sign in'])[1]");
  }

  async login(email, password) {
    console.log("📧 Typing email...");
    await this.username.waitFor({ state: 'visible', timeout: 15000 });
    await this.username.fill(email);

    console.log("🔒 Typing password...");
    await this.password.waitFor({ state: 'visible', timeout: 15000 });
    await this.password.fill(password);

    console.log("🚀 Clicking Sign In...");
    await this.signInBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.signInBtn.click();
  }
}
