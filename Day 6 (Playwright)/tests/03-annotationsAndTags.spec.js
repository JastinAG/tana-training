import { test, expect } from '@playwright/test';

//describe property - Declares a group of tests.
test.describe('Inavlid test Scenarios is Sauce demo site', () => {
	//----------BEFORE EACH HOOK ----------------
	test.beforeEach('Hook that visits the Sauce Demo before each test', async ({ page }) => {
		await page.goto('https://www.saucedemo.com/');
	});
	test('Invalid Username and Valid Password', async ({ page }) => {
		await page.locator('[data-test="username"]').click();
		await page.locator('[data-test="username"]').fill('invalid_user');
		await page.locator('[data-test="password"]').click();
		await page.locator('[data-test="password"]').fill('secret_sauce');
		await page.locator('[data-test="login-button"]').click();

		await expect(page.getByText('password do not match')).toBeVisible();
	});
	test('Invalid Password and Valid Username', async ({ page }) => {
		await page.locator('[data-test="username"]').click();
		await page.locator('[data-test="username"]').fill('standard_user');
		await page.locator('[data-test="password"]').click();
		await page.locator('[data-test="password"]').fill('wrong_password');
		await page.locator('[data-test="login-button"]').click();

		await expect(page.getByText('password do not match')).toBeVisible();
	});

	//----------TEST TAGGED AS CRITICAL ----------------npx pw test --grep @Critical
	test('Invalid Password and Invalid Username @Critical', async ({ page }) => {
		await page.locator('[data-test="username"]').click();
		await page.locator('[data-test="username"]').fill('invalid_user');
		await page.locator('[data-test="password"]').click();
		await page.locator('[data-test="password"]').fill('wrong_password');
		await page.locator('[data-test="login-button"]').click();

		await expect(page.getByText('password do not match')).toBeVisible();
	});

	//----------TEST.ONLY ANNOTATION ----------------
	test.only('Sauce demo Login test', async ({ page }) => {
		await page.goto('https://www.saucedemo.com/');
		await page.locator('[data-test="username"]').click();
		await page.locator('[data-test="username"]').fill('standard_user');
		await page.locator('[data-test="password"]').click();
		await page.locator('[data-test="password"]').fill('secret_sauce');
		await page.locator('[data-test="login-button"]').click();
		//hard assertion - if this faills, the test will stop here
		await expect(page.getByText('Swag Labs')).toBeVisible();
		await page.locator('[data-test="title"]').click();
		await expect(page.locator('[data-test="title"]')).toContainText('Products');
		await page.getByRole('button', { name: 'Open Menu' }).click();
		await page.locator('[data-test="logout-sidebar-link"]').click();
		await expect(page.locator('[data-test="login-button"]')).toBeVisible();
	});
});
