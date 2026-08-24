import { expect, type Page } from "@playwright/test";
import logger from '../utils/logger';

/*
 * This class contains elements that are present on all pages regardless of
 * which page you are on currently. The purpose of this class is to reduce
 * boiler plate code and make common elements available everywhere.
 */
export default class CommonElements {
    readonly page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }
    
/*
 * Collection of a few common elements across all pages
 */
    get homeButton() { return this.page.getByRole('link', { name: /Home/ }); }
    get logInButton() { return this.page.getByRole('link', { name: /Signup \/ Login/ }); }
    get logoutButton() { return this.page.getByRole('link', { name: /Logout/ }); }
    get deleteAccountButton() { return this.page.getByRole('link', { name: /Delete Account/ }); }
    get footer() { return this.page.locator('#footer'); }
    get consentButton() { return this.page.getByRole('button', { name: 'Consent' }); }

/*
 * Methods to verify common elements
 */
    /*
     * Adding a debug level log as demo to this action.
     */
    async acceptCookiesIfVisible() {
        if (await this.consentButton.isVisible()) {
            logger.debug('Cookie consent prompt detected');
            await this.consentButton.click();
        }
    }

    async verifyCommonElements() {
        await expect(this.homeButton).toBeVisible();
        await expect(this.footer).toBeVisible();
    }

    async verifyLoggedOutHeader() {
        await expect(this.logInButton).toBeVisible();
        await expect(this.logoutButton).not.toBeVisible();
        await expect(this.deleteAccountButton).not.toBeVisible();

    }

    async verifyLoggedInHeader() {
        await expect(this.logInButton).not.toBeVisible();
        await expect(this.logoutButton).toBeVisible();
        await expect(this.deleteAccountButton).toBeVisible();
    }   
}