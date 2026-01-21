import { test, expect } from '@playwright/test';

//describe property - Declares a group of tests.
test.describe('Inavlid test Scenarios is Sauce demo site', () => {
	//----------BEFORE EACH HOOK ----------------
	test.beforeEach('Hook that visits the Sauce Demo before each test', async ({ page }) => {
		await page.goto('https://www.saucedemo.com/');
	}); 
	test('Invalid Username and Valid Password', async ({ page }) => {
		// await page.goto('https://www.saucedemo.com/'); //-------REPETITIVE STEP ---------
		await page.locator('[data-test="username"]').click();
		await page.locator('[data-test="username"]').fill('invalid_user');
		await page.locator('[data-test="password"]').click();
		await page.locator('[data-test="password"]').fill('secret_sauce');
		await page.locator('[data-test="login-button"]').click();

		await expect(page.getByText('password do not match')).toBeVisible();
	});
	test('Invalid Password and Valid Username', async ({ page }) => {
		// await page.goto('https://www.saucedemo.com/'); //-------REPETITIVE STEP ---------
		await page.locator('[data-test="username"]').click();
		await page.locator('[data-test="username"]').fill('standard_user');
		await page.locator('[data-test="password"]').click();
		await page.locator('[data-test="password"]').fill('wrong_password');
		await page.locator('[data-test="login-button"]').click();

		await expect(page.getByText('password do not match')).toBeVisible();
	});
	test('Invalid Password and Invalid Username', async ({ page }) => {
		// await page.goto('https://www.saucedemo.com/'); //-------REPETITIVE STEP ---------
		await page.locator('[data-test="username"]').click();
		await page.locator('[data-test="username"]').fill('invalid_user');
		await page.locator('[data-test="password"]').click();
		await page.locator('[data-test="password"]').fill('wrong_password');
		await page.locator('[data-test="login-button"]').click();

		await expect(page.getByText('password do not match')).toBeVisible();
	});
});
