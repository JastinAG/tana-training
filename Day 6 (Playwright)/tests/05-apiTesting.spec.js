import { test, expect } from '@playwright/test';
//describe property - Declares a group of tests.
test.describe('API Testing with Playwright', () => {
	//---------CREATING A NEW POST -------------
	test('POST request to add a new post', async ({ request }) => {
		const response = await request.post('https://jsonplaceholder.typicode.com/posts', {
			data: {
				userId: 1,
				id: 110,
				title: 'Test Post',
				body: 'Test Body',
			},
		});
		expect(response.status()).toBe(201);
		const responseBody = await response.json();
		console.log('The sent data is ', responseBody);
	});
	//---------READING A POST -------------
	test('GET request to JSONPlaceholder and verify response', async ({ request }) => {
		// Make a GET request to the specified URL
		const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');
		// Verify the response status is 200
		expect(response.status()).toBe(200);
		// Verify the response body contains a userId of 1
		const responseBody = await response.json();
		console.log('The Fetched User is: ', responseBody);
		expect(responseBody.userId).toBe(1);
	});
	//---------UPDATING A POST -------------

	test('PUT request to update a post', async ({ request }) => {
		const response = await request.put('https://jsonplaceholder.typicode.com/posts/1', {
			data: {
				userId: 1,
				id: 1,
				title: 'Updated Post',
				body: 'Updated Body',
			},
		});
		expect(response.status()).toBe(200);
		const responseBody = await response.json();
		console.log('The updated data is ', responseBody);
	});
	test('DELETE request to delete a post', async ({ request }) => {
		const response = await request.delete('https://jsonplaceholder.typicode.com/posts/1');
		expect(response.status()).toBe(200);
		console.log('Post deleted successfully');
	});
});

test.describe.only('API Testing with Playwright - Authenticated Requests', () => {
	//---------AUTHENTICATED GET REQUEST -------------
	test('GET request with Basic Auth to protected endpoint', async ({ request }) => {
		const response = await request.get('https://postman-echo.com/basic-auth', {
			headers: {
				Authorization: 'Basic ' + Buffer.from('postman:password').toString('base64'),
			},
		});
	});
	//test that i can do to curl -H "x-api-key: Your-api-KEY" https://reqres.in/api/users?page=2 if the api-key is in my .env file
});

//---------READING FROM REQRES WITH API KEY-------------
test('GET request to reqres.in with API key', async ({ request }) => {
	const apiKey = process.env.REQRES_API_KEY;

	// Make a GET request with API key in headers
	const response = await request.get('https://reqres.in/api/users?page=2', {
		headers: {
			'x-api-key': apiKey,
		},
	});

	// Verify the response status is 200
	expect(response.status()).toBe(200);

	// Parse and verify response body
	const responseBody = await response.json();
	console.log('Users on page 2:', responseBody);

	// Verify the response has data
	expect(responseBody.data).toBeDefined();
	expect(responseBody.page).toBe(2);
	expect(Array.isArray(responseBody.data)).toBe(true);
});
