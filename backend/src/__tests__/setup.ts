import { beforeAll, afterEach, vi } from 'vitest';

beforeAll(() => {
  // Set up any global test configuration
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_EXPIRES_IN = '1h';
});

afterEach(() => {
  // Reset all mocks after each test
  vi.clearAllMocks();
});
