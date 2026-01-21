import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

//describe property - Declares a group of tests.
test.describe('Reqres API Testing - Get Users', () => {
	const REQRES_API_KEY = process.env.REQRES_API_KEY;
	//---------GET REQUEST TO REQRES.IN WITH API KEY -------------
	test('GET request to Reqres.in to fetch users with API key', async ({ request }) => {
		const response = await request.get('https://reqres.in/api/users?page=2', {
			headers: {
				'x-api-key': REQRES_API_KEY,
			},
		});
		// Verify the response status is 200
		expect(response.status()).toBe(200);
		// Parse and verify response body
		const responseBody = await response.json();
		console.log('Users on page 2:', responseBody);
		expect(responseBody.page).toBe(2);
	});
});
test.describe('Reqres API Testing - Create User', () => {
	//---------POST REQUEST TO CREATE A USER -------------
	test('POST request to Reqres.in to create a user', async ({ request }) => {
		const response = await request.post('https://reqres.in/api/users', {
			data: {
				name: 'John Doe',
				job: 'Software Developer',
			},
		});
		// Verify the response status is 201
		expect(response.status()).toBe(201);
		// Parse and verify response body
		const responseBody = await response.json();
		console.log('Created User:', responseBody);
		expect(responseBody.name).toBe('John Doe');
		expect(responseBody.job).toBe('Software Developer');
	});
});
