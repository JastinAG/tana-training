import { test, expect } from '@playwright/test';

test('Sauce demo Login test', async ({ page }) => {
	await page.goto('https://www.saucedemo.com/');
	await page.locator('[data-test="username"]').click();
	await page.locator('[data-test="username"]').fill('standard_user');
	await page.locator('[data-test="password"]').click();
	await page.locator('[data-test="password"]').fill('secret_sauce');
	await page.locator('[data-test="login-button"]').click();
	//hard assertion - if this faills, the test will stop here
	await expect(page.getByText('Swag Labs')).toBeVisible();
	await page.locator('[data-test="title"]').click();
	//soft assertion - if this fails, the test will continue
	await expect.soft(page.locator('[data-test="title"]')).toContainText('No Products');
	await page.getByRole('button', { name: 'Open Menu' }).click();
	await page.locator('[data-test="logout-sidebar-link"]').click();
	await expect(page.locator('[data-test="login-button"]')).toBeVisible();
});
