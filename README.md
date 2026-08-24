# Playwright Automation Template

A reusable **Playwright + TypeScript test automation template** designed to provide a clean starting point for building maintainable UI and API automation solutions.

The purpose of this repository is not to provide exhaustive tests for the example application. Instead, it demonstrates a reusable project architecture with common functionality already configured, allowing the example implementation to be replaced and extended for a real project.

## Features

- Playwright with TypeScript
- Page Object Model (POM)
- Base page inheritance
- Reusable common page elements
- Custom Playwright fixtures
- Automatic fixtures
- Authenticated and unauthenticated test execution
- Reusable authentication state
- Environment-based configuration and credential handling
- Chromium, Firefox and WebKit support
- Project-based test configuration
- Test tagging
- Structured test execution with `test.step()`
- API testing
- Reusable test data
- Winston logging with configurable log levels
- Playwright HTML reporting
- Tracing on retry
- Screenshots on failure
- Video retention on failure

---

## Project Structure

```text
playwright-automation-template/
│
├── fixtures/
│   └── fixtures.ts
│
├── pages/
│   ├── base.page.ts
│   ├── common.elements.ts
│   ├── home.page.ts
│   └── login.page.ts
│
├── test-data/
│   └── users.data.ts
│
├── tests/
│   ├── API/
│   │   └── api-tests.spec.ts
│   │
│   ├── E2E/
│   │   └── home.page.spec.ts
│   │
│   └── auth.setup.ts
│
├── utils/
│   └── logger.ts
│
├── global/
│   └── .auth/
│
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
└── README.md
```

### `pages/`

Contains the Page Object Model implementation.

- `base.page.ts` provides functionality shared by page objects.
- `common.elements.ts` contains elements and functionality available across multiple pages.
- `home.page.ts` and `login.page.ts` demonstrate page-specific POM implementations.

New application pages can be added by extending `BasePage`.

### `fixtures/`

Contains custom Playwright fixtures.

The included fixtures demonstrate how Page Objects can be injected directly into tests:

```ts
test('Example test', async ({ homePage }) => {
    await homePage.goToHomePage();
});
```

The project also demonstrates the use of an automatic fixture for functionality that should be applied without explicitly requesting the fixture in each test.

### `test-data/`

Contains reusable, non-sensitive test data.

For example, account data used by the API tests is exported from a separate data file and imported where required.

Environment-specific values and credentials should **not** be stored here.

### `tests/E2E/`

Contains browser-based end-to-end tests using the Page Object Model and custom fixtures.

### `tests/API/`

Contains examples of API testing using Playwright's request fixture.

The example suite demonstrates:

- GET
- POST
- PUT
- DELETE
- HTTP status validation
- JSON response validation
- Form data
- Combining reusable test data with environment-specific values

### `utils/`

Contains reusable framework utilities.

The included Winston logger demonstrates configurable logging without coupling logging functionality to individual tests or Page Objects.

---

## Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd playwright-automation-template
```

Install the project dependencies:

```bash
npm install
```

Install the Playwright browsers:

```bash
npx playwright install
```

The project is now ready for configuration and execution.

---

## Environment Configuration

Environment-specific configuration and credentials are handled through environment variables.

An example file is provided:

```text
.env.example
```

Create a local `.env` file based on it:

```env
BASE_URL=
USER_EMAIL=
USER_PASSWORD=
LOG_LEVEL=info
```

For the included example implementation:

```env
BASE_URL=https://automationexercise.com/
USER_EMAIL=<your-test-user-email>
USER_PASSWORD=<your-test-user-password>
LOG_LEVEL=info
```

The `.env` file is excluded from Git and **must not be committed**.

The application accesses these values through:

```ts
process.env.BASE_URL
process.env.USER_EMAIL
process.env.USER_PASSWORD
```

This allows the same automation code to run against different environments without changing the source code.

In CI/CD environments, environment variables can be supplied by the corresponding secret/configuration management system instead of using a local `.env` file.

---

## Authentication

The template demonstrates reusable authenticated browser sessions using Playwright `storageState`.

Authentication is performed by:

```text
tests/auth.setup.ts
```

After successful login, the browser authentication state is stored under:

```text
global/.auth/
```

Authenticated Playwright projects then reuse this state instead of logging in again inside every test.

The generated authentication state is excluded from Git because it can contain sensitive session information.

---

## Authenticated and Unauthenticated Tests

Tests can be tagged according to the authentication state they require.

Authenticated example:

```ts
test('Authenticated example', {
    tag: '@authenticated'
}, async ({ homePage }) => {
    // Test implementation
});
```

Unauthenticated example:

```ts
test('Unauthenticated example', {
    tag: '@unauthenticated'
}, async ({ homePage }) => {
    // Test implementation
});
```

A test that is valid in both states can use both tags:

```ts
test('Shared example', {
    tag: ['@authenticated', '@unauthenticated']
}, async ({ homePage }) => {
    // Test implementation
});
```

The Playwright projects use these tags to determine which tests should run under each authentication state.

---

## Browser Projects

The configuration includes authenticated and unauthenticated projects for:

- Chromium
- Firefox
- WebKit

This allows the same tests to be executed across multiple browser engines while preserving the required authentication state.

The project also contains a separate API project that does not require a browser.

---

## Running Tests

Run all configured Playwright projects:

```bash
npm test
```

Run authenticated Chromium tests:

```bash
npm run test:chromium-auth
```

Run unauthenticated Chromium tests:

```bash
npm run test:chromium-unauth
```

Run the API test suite:

```bash
npm run test:api
```

Playwright commands can also be used directly.

For example:

```bash
npx playwright test --ui
```

opens Playwright UI Mode.

To run tests in headed mode:

```bash
npx playwright test --headed
```

---

## Page Object Model

Page-specific classes extend `BasePage`:

```ts
export default class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get categoryHeader() {return this.page.getByRole('heading', { name: 'Category' });}

    async goToHomePage() {
        await this.page.goto('/');
    }
}
```

Shared elements can be accessed through the common elements implementation inherited through the base page.

This keeps selectors and page behavior outside the test specifications and reduces duplication.

---

## Custom Fixtures

Page Objects are provided to tests through custom Playwright fixtures.

Instead of creating a Page Object manually:

```ts
const homePage = new HomePage(page);
```

tests can request it directly:

```ts
test('Example', async ({ homePage }) => {
    await homePage.goToHomePage();
});
```

To add another Page Object to the fixture system:

1. Create the new Page Object.
2. Add its type to `PageFixtures`.
3. Instantiate it in `fixtures.ts`.
4. Request it directly from the test fixture.

This allows the fixture layer to handle Page Object creation while keeping tests focused on test behavior.

---

## Test Steps

Playwright's `test.step()` can be used to divide larger tests into logical sections:

```ts
await test.step('Verify main categories', async () => {
    await expect(homePage.womenCategory).toBeVisible();
    await expect(homePage.menCategory).toBeVisible();
    await expect(homePage.kidsCategory).toBeVisible();
});
```

Steps make test execution easier to follow in Playwright reports and traces and make it clearer which logical part of a test failed.

---

## API Testing

API tests use Playwright's built-in `request` fixture.

Example:

```ts
test('GET all products', async ({ request }) => {
    const response = await request.get('/api/productsList');

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.responseCode).toBe(200);
});
```

API tests are kept separate from browser-specific Page Objects and fixtures.

---

## Test Data

Reusable non-sensitive data can be stored under:

```text
test-data/
```

For example:

```ts
export const updateUserData = {
    name: 'API Test User',
    title: 'Mr',
    firstname: 'API',
    lastname: 'Tester'
};
```

It can then be combined with environment-specific values:

```ts
form: {
    ...updateUserData,
    email: process.env.USER_EMAIL!,
    password: process.env.USER_PASSWORD!,
}
```

This keeps static test data separate from credentials and test logic.

---

## Logging

The template uses Winston for configurable logging.

Example:

```ts
logger.info('Starting authentication');
logger.http('Sending GET request to /api/productsList');
logger.debug('Cookie consent prompt detected');
```

The log level can optionally be configured through:

```env
LOG_LEVEL=info
```

Available levels, from highest to lowest priority:

```text
error
warn
info
http
verbose
debug
silly
```

Selecting a level includes that level and all higher-priority levels.

For example:

```env
LOG_LEVEL=info
```

outputs:

```text
error
warn
info
```

while lower-priority levels such as `debug` are suppressed.

If no log level is configured, the logger defaults to `info`.

---

## Reporting and Debugging

The template uses Playwright's built-in debugging and reporting capabilities.

The configuration includes:

```ts
trace: 'on-first-retry',
screenshot: 'only-on-failure',
video: 'retain-on-failure'
```

This provides useful diagnostic information when a test fails without generating unnecessary artifacts for every successful execution.

To open the latest HTML report:

```bash
npx playwright show-report
```

Playwright UI Mode can also be used for interactive test execution and investigation:

```bash
npx playwright test --ui
```

---

## Adding a New Page

Create a new Page Object under `pages/`:

```ts
import { type Page } from '@playwright/test';
import BasePage from './base.page';

export default class ProductsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get productsHeader() {return this.page.getByRole('heading', { name: 'All Products' });}

    async goToProductsPage() {
        await this.page.goto('/products');
    }
}
```

Then add it to the custom fixtures.

The new Page Object can then be injected directly into tests:

```ts
test('Products example', async ({ productsPage }) => {
    await productsPage.goToProductsPage();
});
```

---

## Using This Template for a New Project

This repository intentionally contains only a small example implementation.

When starting a real automation project:

1. Clone or fork the repository.
2. Install dependencies and Playwright browsers.
3. Configure the required environment variables.
4. Replace the example Page Objects with Page Objects for the application under test.
5. Add the new Page Objects to the fixture configuration.
6. Replace the example E2E and API tests with project-specific tests.
7. Add reusable test data where required.
8. Adjust Playwright projects, authentication and configuration to match the target application.
9. Extend the framework only when the project has a concrete need for additional infrastructure.

The template is intentionally kept lightweight so that project-specific architecture can be added without first having to remove unnecessary framework abstractions.

---

## Security

Do not commit:

- `.env`
- credentials
- API keys
- authentication tokens
- generated Playwright authentication state

The repository includes `.gitignore` rules for local environment files, authentication state, test results and generated reports.

For shared or CI/CD environments, credentials should be provided through the secret management functionality of the selected platform.

---

## Example Application

The included example implementation uses Automation Exercise as the application under test.

The example application exists only to demonstrate the architecture of the template. The repository is not intended to provide comprehensive test coverage of Automation Exercise.

---

## License

This project is licensed under the MIT License.

You are free to use, modify and distribute the template in accordance with the terms of the license.
