import { test, expect } from '../fixtures/apiContextFixture';
import { buildUserPayload } from '../src/data/userFactory';

test.describe('Users API - CRUD', () => {
  let createdUserId: string | number | undefined;

  test('GET list users - valid', async ({ apiContext }) => {
    // Manual timing to measure performance as APIResponse doesn't support .timing()
    const startTime = Date.now();
    const response = await apiContext.get('/api/users', {
      params: { page: 2 }
    });
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.support.url).toContain('reqres.in');
    expect(response.headers()['content-type']).toContain('application/json');

    // Requirement: Meaningful assertions beyond status codes (performance)
    expect(duration).toBeLessThan(1000);
  });

  test('GET single user - not found', async ({ apiContext }) => {
    const response = await apiContext.get('/api/users/9999');

    expect(response.status()).toBe(404);

    const text = await response.text();
    // Some APIs return empty strings or empty objects for 404s
    expect(text === '' || text === '{}').toBeTruthy();
  });

  test('POST create user - valid', async ({ apiContext }) => {
    // Requirement: Use programmatically generated test data
    const payload = buildUserPayload();

    const response = await apiContext.post('/api/users', {
      data: payload
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();

    // Store ID for cleanup/teardown
    createdUserId = body.id;
  });

  test('POST create user - "invalid" payload still accepted', async ({
    apiContext
  }) => {
    const response = await apiContext.post('/api/users', {
      data: { invalid: 'field' }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('PUT update user - valid', async ({ apiContext }) => {
    const payload = buildUserPayload({ job: 'Senior QA Engineer' });

    const response = await apiContext.put('/api/users/2', {
      data: payload
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.updatedAt).toBeDefined();
  });

  test('PUT update user - invalid user id returns 200 on ReqRes', async ({
    apiContext
  }) => {
    const payload = buildUserPayload();

    const response = await apiContext.put('/api/users/9999', {
      data: payload
    });

    // Note: ReqRes is a mock API and often returns 200 even for non-existent IDs on PUT
    expect(response.status()).toBe(200);
  });

  test('DELETE user - valid', async ({ apiContext }) => {
    const response = await apiContext.delete('/api/users/2');

    expect(response.status()).toBe(204);

    const text = await response.text();
    expect(text).toBe('');
  });

  test('DELETE user - invalid id still returns 204 on ReqRes', async ({
    apiContext
  }) => {
    const response = await apiContext.delete('/api/users/9999');

    expect(response.status()).toBe(204);
  });

  // Requirement: Strategic data cleanup
  test.afterAll(async ({ apiContext }) => {
    if (createdUserId) {
      await apiContext.delete(`/api/users/${createdUserId}`);
    }
  });
});