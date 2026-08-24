import { test as setup, expect } from '@playwright/test';
import LoginPage from '../pages/login.page';
import logger from '../utils/logger';

/*
 * Authenticating the user.
 * Adding info level logs as a demonstration of logging during authentication.
 */
const authFile = 'global/.auth/user.json';

setup('authenticate', async ({ page }) => {
    logger.info('Starting authentication');
    const loginPage = new LoginPage(page);

    await loginPage.goToLogInPage();

    logger.info('Accepting cookie consent if visible');
    await loginPage.commonElements.acceptCookiesIfVisible();

    logger.info('Logging in');
    await loginPage.logIn(
        process.env.USER_EMAIL!,
        process.env.USER_PASSWORD!
    );

    await expect(page).toHaveURL(process.env.BASE_URL!);
    logger.info('Authentication successful');

    await page.context().storageState({ path: authFile });
});