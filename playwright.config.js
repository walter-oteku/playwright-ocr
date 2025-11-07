// // playwright.config.js
// import { defineConfig, devices } from '@playwright/test';

// // 🕒 Generate timestamped folder for each report run
// const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
// const reportFolder = `playwright-report/report-${timestamp}`;

// export default defineConfig({
//   // === TEST DISCOVERY & RUNTIME ===
//   testDir: './tests',                         // Root test folder
//   testMatch: /.*\.(spec|test|js)/,            // 🔍 Detect all JS test files, not just .spec.js
//   timeout: 60 * 1000,                         // Global test timeout (60s)
//   expect: { timeout: 10 * 1000 },             // Assertion timeout (10s)
//   fullyParallel: true,                        // Run tests in parallel
//   retries: 1,                                 // Retry failed tests once

//   // === REPORTERS ===
//   reporter: [
//     ['list'],                                // CLI output
//     ['html', { outputFolder: reportFolder, open: 'never' }], // HTML report (timestamped)
//     ['json', { outputFile: `${reportFolder}/report.json` }], // JSON for CI/CD or analytics
//   ],

//   // === TEST BEHAVIOR ===
//   use: {
//     baseURL: 'https://ocr.techsavanna.technology',
//     headless: false,                         // Run with browser visible
//     viewport: { width: 1280, height: 720 },
//     actionTimeout: 15 * 1000,
//     navigationTimeout: 30 * 1000,

//     // === DEBUGGING & EVIDENCE ===
//     trace: 'on-first-retry',                 // Record trace only on retry
//     screenshot: 'only-on-failure',           // Take screenshots only when a test fails
//     video: 'retain-on-failure',              // Keep videos only for failed tests
//   },

//   // === PROJECT SETUP ===
//   projects: [
//     {
//       name: 'setup',
//       testMatch: /.*\.setup\.js/,            // Authentication or environment setup scripts
//     },
//     {
//       name: 'chromium',
//       use: {
//         ...devices['Desktop Chrome'],
//         storageState: 'playwright/.auth/user.json', // Uses session from setup
//       },
//       dependencies: ['setup'],
//     },
//     // Optional: enable for multi-browser coverage
//     // {
//     //   name: 'firefox',
//     //   use: { ...devices['Desktop Firefox'] },
//     // },
//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     // },
//   ],

//   // === OUTPUT FOLDERS ===
//   outputDir: 'test-results/', // Where screenshots, videos, and traces are stored
// });

// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// 🕒 Timestamped folder for unique reports
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportFolder = `playwright-report/report-${timestamp}`;

// 🌍 Base URLs for different environments
const ENVIRONMENTS = {
  local: 'http://localhost:3000',
  staging: 'https://staging.ocr.techsavanna.technology',
  prod: 'https://ocr.techsavanna.technology'
};

// Pick environment from CLI or fallback to production
const ENV = process.env.ENV || 'prod';

export default defineConfig({
  // === TEST DISCOVERY & EXECUTION ===
  testDir: './tests',
  // ✅ Only pick up files ending with .spec.js or .test.js
  testMatch: /.*\.(spec|test)\.js/,
  // ✅ Skip all setup files during normal runs
  testIgnore: ['**/*.setup.js'],

  fullyParallel: true,
  retries: 1,
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },

  // === REPORTING ===
  reporter: [
    ['list'],
    ['html', { outputFolder: reportFolder, open: 'never' }],
    ['json', { outputFile: `${reportFolder}/report.json` }],
    ['junit', { outputFile: `${reportFolder}/results.xml` }], // 🧩 CI-compatible
  ],

  // === COMMON TEST BEHAVIOR ===
  use: {
    baseURL: ENVIRONMENTS[ENV],
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    launchOptions: {
      slowMo: process.env.SLOWMO ? 200 : 0,
      args: ['--start-maximized'],
    },
  },

  // === PROJECTS ===
  projects: [
    // 🔹 Runs only when you explicitly want to refresh login
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },

    // 🔹 Default Chromium project that reuses saved auth
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: path.resolve('playwright/.auth/user.json'),
      },
    },

    // Optional cross-browser configs:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
    // },
  ],

  // === OUTPUT MANAGEMENT ===
  outputDir: 'test-results/',
});


