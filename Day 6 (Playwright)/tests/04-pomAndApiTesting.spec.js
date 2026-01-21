import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';

//describe property - Declares a group of tests.
test.describe('Inavlid test Scenarios is Sauce demo site', () => {
	//----------INSTANTIATING THE CLASS ------------

	//----------BEFORE EACH HOOK ----------------
	test.beforeEach('Hook that visits the Sauce Demo before each test', async ({ page }) => {
		await page.goto('https://www.saucedemo.com/');
	});

	//--------- OOP CONCEPTS -------------
	test('Invalid Username and Valid Password', async ({ page }) => {
		const login = new LoginPage(page);
		await login.attemptLogin('wrong_user', 'secret_sauce');
		await expect(page.getByText('password do not match')).toBeVisible();
	});
	test('Invalid Password and Valid Username', async ({ page }) => {
		const login = new LoginPage(page);
		await login.attemptLogin('standard_user', 'wrong_password');
		await expect(page.getByText('password do not match')).toBeVisible();
	});
	test('Invalid Password and Invalid Username', async ({ page }) => {
		const login = new LoginPage(page);
		await login.attemptLogin('wrong_user', 'wrong_password');
		await expect(page.getByText('password do not match')).toBeVisible();
	});
});
