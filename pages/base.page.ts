import { type Page} from "@playwright/test";
import CommonElements from "./common.elements";

/* 
 * This is the base page, a super class for all other pages.
 * It contains the common elements and the page object.
 */
export default class BasePage {
    readonly page: Page;
    readonly commonElements: CommonElements;

    constructor(page: Page) {
        this.page = page;
        this.commonElements = new CommonElements(page);
    }

/* 
 * Reusable methods for the base page
 */ 
    async verifyCommonElementsLoggedIn() {
        await this.commonElements.verifyCommonElements();
        await this.commonElements.verifyLoggedInHeader();
    }

    async verifyCommonElementsLoggedOut() {
        await this.commonElements.verifyCommonElements();
        await this.commonElements.verifyLoggedOutHeader();
    }
}