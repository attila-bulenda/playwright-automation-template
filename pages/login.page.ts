import { type Page} from "@playwright/test";
import BasePage from "./base.page";

export default class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

/*
 * Page elements 
 */

    /*
     * Login part
     */
    get loginForm() {return this.page.locator('.login-form');}
    get loginHeader() {return this.page.getByRole('heading', { name: 'Login to your account' });}
    get loginEmailField() {return this.page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');}
    get loginPasswordField() {return this.page.getByRole('textbox', { name: 'Password' });}
    get loginButton() {return this.page.getByRole('button', { name: 'Login' });}
    
    /*
     * Register new user part 
     */
    get signupForm() {return this.page.locator('.signup-form');}
    get signupHeader() {return this.page.getByRole('heading', { name: 'New User Signup!' });}
    get signupNameField() {return this.page.locator('input[data-qa="signup-name"]');}
    get signupEmailField() {return this.page.locator('input[data-qa="signup-email"]');}
    get signupButton() {return this.page.getByRole('button', { name: 'Signup' });}

    /*
     * Other
     */
    get orHeader() {return this.page.getByRole('heading', { name: 'OR', exact: true });}

/*
 * Page actions
 */
    async goToLogInPage() {
        await this.page.goto("/login");
    }

    async logIn(email: string, password: string) {
        await this.loginEmailField.fill(email);
        await this.loginPasswordField.fill(password);
        await this.loginButton.click();
    }

    async signUpNewUser(name: string, email: string) {
        await this.signupNameField.fill(name);
        await this.signupEmailField.fill(email);
        await this.signupButton.click();
    }
}

