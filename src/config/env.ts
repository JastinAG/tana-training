export type TestEnv = 'dev' | 'staging' | 'prod';

const env = (process.env.TEST_ENV as TestEnv) || 'dev';

const styleUrls: Record<TestEnv, string> = {
  dev: 'https://reqres.in',
  staging: 'https://reqres.in',
  prod: 'https://reqres.in'
};

export const config = {
  env,
  baseURL: styleUrls[env], // Ensure this is 'baseURL' to match your fixture
  defaultTimeoutMs: 1000
};