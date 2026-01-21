//i want to have a reusable class and a method that i will use in my tests, start with login, where i get the page locators in the constructor and have a method to attempt login with username and password
import { test, expect } from '@playwright/test';

export class LoginPage {
	constructor(page) {
		this.page = page;
		this.usernameInput = page.locator('[data-test="username"]');
		this.passwordInput = page.locator('[data-test="password"]');
		this.loginButton = page.locator('[data-test="login-button"]');
	}

	async login(username, password) {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.loginButton.press('Enter');
	}
}
