export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator('input[placeholder="Enter your email or username"]');
    this.password = page.locator('input[placeholder="Enter your password"]');
    this.signInBtn = page.locator("//button[normalize-space()='Sign in']");
  }

  async login(email, password) {
    await this.username.fill(email);
    await this.password.fill(password);
    await this.signInBtn.click();
  }
}
