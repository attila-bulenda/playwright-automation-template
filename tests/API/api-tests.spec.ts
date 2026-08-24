import { test, expect } from '@playwright/test';
import { updateUserData } from '../../test-data/users.data';
import logger from '../../utils/logger';

/*
 * This API test set is here to demonstrate the API test capabilities of Playwright
 * with the help of the request fixture. In a normal scenario the API tests should
 * be organized into groups based on context. Here we only demonstrate the use of
 * GET, POST, PUT, and DELETE requests.
 */
test.describe('API tests', () => {

    /*
     * Adding http level logs as a demonstration of API request logging.
     */
    test('GET all products', async ({ request }) => {
        logger.http('Sending GET request to /api/productsList');
        const response = await request.get('/api/productsList');
        logger.http(`GET /api/productsList returned HTTP ${response.status()}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products).toBeDefined();
        expect(responseBody.products.length).toBeGreaterThan(0);
    });

    test('POST verify login with valid credentials', async ({ request }) => {
        const response = await request.post('/api/verifyLogin', {
            form: {
                email: process.env.USER_EMAIL!,
                password: process.env.USER_PASSWORD!,
            },
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User exists!');
    });

    test('DELETE verify login returns method not supported', async ({ request }) => {
        const response = await request.delete('/api/verifyLogin');
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.responseCode).toBe(405);
        expect(responseBody.message).toBe('This request method is not supported.');
    });

    /*
     * Test data is imported here from /test-data/users.data.ts
     */
    test('PUT update user account', async ({ request }) => {
        const response = await request.put('/api/updateAccount', {
            form: {
                ...updateUserData,
                email: process.env.USER_EMAIL!,
                password: process.env.USER_PASSWORD!,
            },
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User updated!');
    });
});