import { type Page} from "@playwright/test";
import BasePage from "./base.page";

export default class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

/*
 * Page elements 
 */

    /*
     * Select few categories and sub-categories from side-menu
     */ 
    get categoryHeader() {return this.page.getByRole('heading', { name: 'Category' });}
    get womenCategory() {return this.page.getByRole('link', { name: 'Women'});}
    get menCategory() {return this.page.locator('a[href="#Men"]');}
    get kidsCategory() {return this.page.locator('a[href="#Kids"]');}
    get womenDressOption() {return this.page.getByRole('link', { name: 'Dress', exact: true });}
    get womenTopsOption() {return this.page.getByRole('link', { name: 'Tops', exact: true });}
    get womenSareeOption() {return this.page.getByRole('link', { name: 'Saree', exact: true });}

/*
 * Page actions
 */
    async goToHomePage() {
        await this.page.goto("/");
    }

}

