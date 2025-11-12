
// // tests/utils.js

// /**
//  * Logs a message in a clean, readable format with a small delay between steps.
//  * Example: await logStep("Logging into the system...");
//  */
// export async function logStep(message, testName = "") {
//   console.log(`🧭 [${testName}] ${message}`);
//   await new Promise(resolve => setTimeout(resolve, 250)); // small delay for clarity
// }

// /**
//  * Waits for the page to fully load and ensures a given text is present.
//  * Useful right after navigation or tab switching.
//  */
// export async function waitForPageLoad(page, text, testName = "") {
//   await page.waitForLoadState('networkidle');

//   if (!text) {
//     console.warn(`⚠️ [${testName}] No text provided for waitForPageLoad() — skipping text visibility check.`);
//     return;
//   }

//   try {
//     await page.waitForSelector(`text=${text}`, { timeout: 10000 });
//     console.log(`✅ [${testName}] Page loaded and text "${text}" is visible.`);
//   } catch (err) {
//     console.error(`❌ [${testName}] Could not find text "${text}" within 10s.`);
//     throw err;
//   }
// }

// /**
//  * Waits for a locator (element) to be visible on the screen.
//  */
// export async function waitForVisible(locator, timeout = 10000, testName = "") {
//   await locator.waitFor({ state: 'visible', timeout });
//   console.log(`👀 [${testName}] Element became visible: ${locator}`);
// }

// /**
//  * Clicks a locator and waits for a specific text to appear, confirming navigation or state change.
//  */
// export async function clickAndWait(page, locator, text, testName = "") {
//   await page.locator(locator).click();
//   await waitForPageLoad(page, text, testName);
// }

// /**
//  * Gracefully handles optional steps (e.g., dismissing modals) without breaking the test.
//  */
// export async function tryStep(fn, description = "Optional step", testName = "") {
//   try {
//     await fn();
//     console.log(`✨ [${testName}] ${description} executed successfully.`);
//   } catch (err) {
//     console.warn(`⚠️ [${testName}] ${description} skipped: ${err.message}`);
//   }
// }


// tests/utils.js

/**
 * Logs a message in a clean, readable format with a small delay between steps.
 * Example: await logStep("Logging into the system...");
 */
export async function logStep(message, testName = "") {
  console.log(`🧭 [${testName}] ${message}`);
  await new Promise(resolve => setTimeout(resolve, 250)); // small delay for clarity
}

/**
 * Waits for the page to fully load and ensures a given text is present.
 * Useful right after navigation or tab switching.
 */
export async function waitForPageLoad(page, text, testName = "") {
  await page.waitForLoadState('networkidle');

  if (!text) {
    console.warn(`⚠️ [${testName}] No text provided for waitForPageLoad() — skipping text visibility check.`);
    return;
  }

  try {
    await page.waitForSelector(`text=${text}`, { timeout: 10000 });
    console.log(`✅ [${testName}] Page loaded and text "${text}" is visible.`);
  } catch (err) {
    console.error(`❌ [${testName}] Could not find text "${text}" within 10s.`);
    throw err;
  }
}

/**
 * Waits for a locator (element) to be visible on the screen.
 */
export async function waitForVisible(locator, timeout = 10000, testName = "") {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    console.log(`👀 [${testName}] Element became visible: ${locator}`);
  } catch (error) {
    console.error(`❌ [${testName}] Element did not become visible within ${timeout}ms: ${locator}`);
    console.error(`🔍 Selector details: ${await locator.toString()}`);
    throw error;
  }
}

/**
 * Clicks a locator and waits for a specific text to appear, confirming navigation or state change.
 */
export async function clickAndWait(page, locator, text, testName = "") {
  await page.locator(locator).click();
  await waitForPageLoad(page, text, testName);
}

/**
 * Gracefully handles optional steps (e.g., dismissing modals) without breaking the test.
 */
export async function tryStep(fn, description = "Optional step", testName = "") {
  try {
    await fn();
    console.log(`✨ [${testName}] ${description} executed successfully.`);
  } catch (err) {
    console.warn(`⚠️ [${testName}] ${description} skipped: ${err.message}`);
  }
}

/**
 * Finds an element using multiple possible selectors
 * Returns the first matching visible element
 */
export async function findElementByMultipleSelectors(page, selectors, timeout = 5000, testName = "") {
  for (const selector of selectors) {
    try {
      const locator = page.locator(selector).first();
      if (await locator.isVisible({ timeout: 2000 })) {
        console.log(`✅ [${testName}] Found element using selector: ${selector}`);
        return locator;
      }
    } catch (err) {
      // Continue to next selector
      continue;
    }
  }
  
  console.error(`❌ [${testName}] Could not find element with any selector: ${selectors.join(', ')}`);
  return null;
}

/**
 * Takes a screenshot and saves it with a descriptive name
 */
export async function takeScreenshot(page, name, testName = "") {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `screenshot-${name}-${timestamp}.png`;
  await page.screenshot({ path: filename, fullPage: true });
  console.log(`📸 [${testName}] Screenshot saved: ${filename}`);
  return filename;
}