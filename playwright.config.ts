import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Import the env variables from the .env file.
dotenv.config();
// Validate that the required env variables are present:
const requiredEnvVariables = [
    'BASE_URL',
    'USER_EMAIL',
    'USER_PASSWORD'
];
for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

/*
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  /* Configure projects for authentication and major browsers */
  projects: [
    
    /*
     * This is the project that logs the user in and saves the state of the user
     * in global/.auth/user.json. It picks up the file tests/auth.setup.ts.
     */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    /*
     * This is a configured project to run the tests without logging in first. It is
     * marked with the @unauthenticated tag, so it will only pick up tests that are 
     * using this tag.
     */
    {
      name: 'chromium-unauthenticated',
      grep: /@unauthenticated/,
      use: {
          ...devices['Desktop Chrome'],
      },
    },

    /*
     * This is a configured project to run the tests logging in first. The project
     * has a dependency on the 'setup' project configured above. It will authenticate
     * first, then try to run the tests in this current project. It is also marked
     * with the @authenticated tag, so it will only pick up tests that are using this tag.
     */
    {
      name: 'chromium-authenticated',
      grep: /@authenticated/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: 'global/.auth/user.json', 
      },
      dependencies: ['setup']
    },

    //Below here you can find the same configuration for other browser types.
    {
      name: 'firefox-unauthenticated',
      grep: /@unauthenticated/,
      use: {
          ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'firefox-authenticated',
      grep: /@authenticated/,
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'global/.auth/user.json', 
      },
      dependencies: ['setup']
    },

    {
      name: 'webkit-unauthenticated',
      grep: /@unauthenticated/,
      use: {
          ...devices['Desktop Safari'],
      },
    },

    {
      name: 'webkit-authenticated',
      grep: /@authenticated/,
      use: { 
        ...devices['Desktop Safari'],
        storageState: 'global/.auth/user.json', 
      },
      dependencies: ['setup']
    },

    // This is a separate project for running the API tests
    {
        name: 'api',
        testMatch: /.*api-tests\.spec\.ts/,
    },
  ],
});
