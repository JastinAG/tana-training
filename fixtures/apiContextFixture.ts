import { test as base, request, APIRequestContext } from '@playwright/test';
import { ensureMockServer } from './mockServer';

type ApiFixtures = {
  apiContext: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({}, use) => {
    // Use a lightweight local mock server to avoid external dependency/403s.
    const baseURL = await ensureMockServer();

    // Create a dedicated API context with the same baseURL/headers we use in config
    const apiContext = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Chromium";v="120", "Google Chrome";v="120", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        Origin: baseURL,
        Referer: `${baseURL}/`
      }
    });

    await use(apiContext);
    await apiContext.dispose();
  }
});

export const expect = test.expect;