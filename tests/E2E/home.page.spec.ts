import { test, expect } from '../../fixtures/fixtures';

test.describe("Verifying the landing page", () =>{

    /* 
     * Before each test start we accept the cookies popup if visible, so that
     * Playwright can click elements in the DOM
     */
    test.beforeEach("Accept cookies if prompt is visible", async({homePage}) => {
        await homePage.goToHomePage();
        await homePage.commonElements.acceptCookiesIfVisible();
    });

    /* 
     * Verifying the elements in an authenticated state. The test only runs if we
     * run the correct project with tags for authenticated state.
     */
    test("Testing that common elements are visible on the home page when logged in", {
        tag: '@authenticated'
    }, async ({ homePage }) => {
        await homePage.verifyCommonElementsLoggedIn();
    });

    /* 
     * Verifying the elements in an unauthenticated state. The test only runs if we
     * run the correct project with tags for unauthenticated state.
     */
    test("Testing that common elements are visible on the home page when not logged in", {
        tag: '@unauthenticated'
    }, async ({ homePage }) => {
        await homePage.verifyCommonElementsLoggedOut();
    });

    /* 
     * This test can be run both authenticated and unauthenticated. In addition it demonstrates
     * how we can further break down our individual tests into specific test step groups
     * in order to have better identification of failures in the test report.
     */
    test("Verifying that home page specific elements are visible", {
        tag: ['@authenticated', '@unauthenticated']
    }, async ({ homePage }) => {

        await test.step("Verifying category header", async ()=> {
            await expect(homePage.categoryHeader).toBeVisible();
        });

        await test.step("Verifying main clothes categories", async ()=> {
            await expect(homePage.womenCategory).toBeVisible();
            await expect(homePage.menCategory).toBeVisible();
            await expect(homePage.kidsCategory).toBeVisible();
        });

        await test.step("Verifying subcategories of women section", async ()=> {
            await homePage.womenCategory.click();
            await expect(homePage.womenDressOption).toBeVisible();
            await expect(homePage.womenTopsOption).toBeVisible();
            await expect(homePage.womenSareeOption).toBeVisible();
        });

    });
})