
// // playwright.config.js
// import { defineConfig, devices } from '@playwright/test';
// import path from 'path';

// // 🕒 Timestamped folder for unique reports
// const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
// const reportFolder = `playwright-report/report-${timestamp}`;

// // 🌍 Base URLs for different environments
// const ENVIRONMENTS = {
//   local: 'http://localhost:3000',
//   staging: 'https://staging.ocr.techsavanna.technology',
//   prod: 'https://ocr.techsavanna.technology'
// };

// // Pick environment from CLI or fallback to production
// const ENV = process.env.ENV || 'prod';

// export default defineConfig({
//   // === TEST DISCOVERY & EXECUTION ===
//   testDir: './tests',
//   // ✅ Only pick up files ending with .spec.js or .test.js
//   testMatch: /.*\.(spec|test)\.js/,
//   // ✅ Skip all setup files during normal runs
//   testIgnore: ['**/*.setup.js'],

//   fullyParallel: true,
//   retries: 1,
//   timeout: 60 * 1000,
//   expect: { timeout: 10 * 1000 },

//   // === REPORTING ===
//   reporter: [
//     ['list'],
//     ['html', { outputFolder: reportFolder, open: 'never' }],
//     ['json', { outputFile: `${reportFolder}/report.json` }],
//     ['junit', { outputFile: `${reportFolder}/results.xml` }], // 🧩 CI-compatible
//   ],

//   // === COMMON TEST BEHAVIOR ===
//   use: {
//     baseURL: ENVIRONMENTS[ENV],
//     headless: false,
//     viewport: { width: 1280, height: 720 },
//     ignoreHTTPSErrors: true,
//     actionTimeout: 15 * 1000,
//     navigationTimeout: 30 * 1000,

//     trace: 'retain-on-failure',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',

//     launchOptions: {
//       slowMo: process.env.SLOWMO ? 200 : 0,
//       args: ['--start-maximized'],
//     },
//   },

//   // === PROJECTS ===
//   projects: [
//     // 🔹 Runs only when you explicitly want to refresh login
//     {
//       name: 'setup',
//       testMatch: /.*\.setup\.js/,
//     },

//     // 🔹 Default Chromium project that reuses saved auth
//     {
//       name: 'chromium',
//       use: {
//         ...devices['Desktop Chrome'],
//         storageState: path.resolve('playwright/.auth/user.json'),
//       },
//     },

//     // Optional cross-browser configs:
//     // {
//     //   name: 'firefox',
//     //   use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
//     // },
//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
//     // },
//   ],

//   // === OUTPUT MANAGEMENT ===
//   outputDir: 'test-results/',
// });


// playwright.config.js
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// 🕒 Create timestamped folder for unique reports
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportFolder = `playwright-report/report-${timestamp}`;

// 🌍 Base URLs for different environments
const ENVIRONMENTS = {
  local: 'http://localhost:3000',
  staging: 'https://staging.ocr.techsavanna.technology',
  prod: 'https://ocr.techsavanna.technology'
};

// 📦 Environment selector (CLI: ENV=staging npx playwright test)
const ENV = process.env.ENV || 'prod';

// 📁 Load credentials from config if available
const credentialsPath = path.resolve('./config/credentials.json');
let credentials = {};
if (fs.existsSync(credentialsPath)) {
  credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
  console.log('✅ Loaded credentials:', Object.keys(credentials));
} else {
  console.warn('⚠️ No credentials.json found under /config. Using default blank object.');
}

// 💾 Default storage for authenticated state
const authStorage = path.resolve('playwright/.auth/user.json');

// 🎯 Export full config
export default defineConfig({
  // === TEST DISCOVERY & EXECUTION ===
  testDir: './tests',
  testMatch: /.*\.(spec|test)\.js/,
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
    ['junit', { outputFile: `${reportFolder}/results.xml` }], // CI-friendly
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
    // 🔹 Setup Project (used only for login setup)
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      use: { ...devices['Desktop Chrome'] },
    },

    // 🔹 Main Test Project (reuses authenticated state)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: fs.existsSync(authStorage)
          ? authStorage
          : undefined,
      },
    },
  ],

  // === OUTPUT MANAGEMENT ===
  outputDir: 'test-results/',
});

