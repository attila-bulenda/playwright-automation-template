import { test as base } from '@playwright/test';
import HomePage from '../pages/home.page';
import LoginPage from '../pages/login.page';

/*
 * Creating the basic contract for the structure of the page fixtures.
 */
type PageFixtures = {
    homePage: HomePage;
    loginPage: LoginPage;
};

/*
 * We extend our tests so that we can directly inject our fixtures in our tests.
 */
export const test = base.extend<PageFixtures & { blockAds: void }>({

    /*
     * We block all advertisements popping up during testing
     */
    blockAds: [async ({ page }, use) => {
        await page.route(/googleads|doubleclick|googlesyndication/, route => route.abort());
        await use();
    }, { auto: true }],

    /*
     * We add the page fixtures here.
     */
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});

export { expect } from '@playwright/test';