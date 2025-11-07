export async function waitForPageLoad(page, text) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector(`text=${text}`, { timeout: 10000 });
}

export async function clickAndWait(page, locator, text) {
  await page.locator(locator).click();
  await waitForPageLoad(page, text);
}
