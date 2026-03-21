import { TestBed } from '@angular/core/testing';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};

    global.Storage.prototype.getItem = vi.fn((key: string) => localStorageMock[key] || null);
    global.Storage.prototype.setItem = vi.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    global.Storage.prototype.removeItem = vi.fn((key: string) => {
      delete localStorageMock[key];
    });
    global.Storage.prototype.clear = vi.fn(() => {
      localStorageMock = {};
    });

    TestBed.configureTestingModule({
      providers: [TokenService],
    });

    service = TestBed.inject(TokenService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getAccessToken', () => {
    it('should return access token from localStorage', () => {
      const mockToken = 'mock-access-token';
      localStorageMock['access_token'] = mockToken;

      const token = service.getAccessToken();

      expect(token).toBe(mockToken);
      expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
    });

    it('should return null when no access token exists', () => {
      const token = service.getAccessToken();

      expect(token).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
    });

    it('should return the exact stored value without modification', () => {
      const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature';
      localStorageMock['access_token'] = jwtToken;

      expect(service.getAccessToken()).toBe(jwtToken);
    });

    it('should not read from refresh_token key', () => {
      localStorageMock['refresh_token'] = 'refresh-value';

      const token = service.getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      const mockToken = 'mock-refresh-token';
      localStorageMock['refresh_token'] = mockToken;

      const token = service.getRefreshToken();

      expect(token).toBe(mockToken);
      expect(localStorage.getItem).toHaveBeenCalledWith('refresh_token');
    });

    it('should return null when no refresh token exists', () => {
      const token = service.getRefreshToken();

      expect(token).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('refresh_token');
    });

    it('should return the exact stored value without modification', () => {
      const refreshValue = 'long-refresh-token-value-abc123';
      localStorageMock['refresh_token'] = refreshValue;

      expect(service.getRefreshToken()).toBe(refreshValue);
    });

    it('should not read from access_token key', () => {
      localStorageMock['access_token'] = 'access-value';

      const token = service.getRefreshToken();

      expect(token).toBeNull();
    });
  });

  describe('setTokens', () => {
    it('should store both tokens in localStorage', () => {
      const accessToken = 'new-access-token';
      const refreshToken = 'new-refresh-token';

      service.setTokens(accessToken, refreshToken);

      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', accessToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', refreshToken);
      expect(localStorageMock['access_token']).toBe(accessToken);
      expect(localStorageMock['refresh_token']).toBe(refreshToken);
    });

    it('should overwrite existing tokens', () => {
      localStorageMock['access_token'] = 'old-access-token';
      localStorageMock['refresh_token'] = 'old-refresh-token';

      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      service.setTokens(newAccessToken, newRefreshToken);

      expect(localStorageMock['access_token']).toBe(newAccessToken);
      expect(localStorageMock['refresh_token']).toBe(newRefreshToken);
    });
  });

  describe('clearTokens', () => {
    it('should remove both tokens from localStorage', () => {
      localStorageMock['access_token'] = 'access-token';
      localStorageMock['refresh_token'] = 'refresh-token';

      service.clearTokens();

      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(localStorageMock['access_token']).toBeUndefined();
      expect(localStorageMock['refresh_token']).toBeUndefined();
    });

    it('should not throw error when tokens do not exist', () => {
      expect(() => service.clearTokens()).not.toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for null or empty token', () => {
      expect(service.isTokenExpired(null as any)).toBe(true);
      expect(service.isTokenExpired('')).toBe(true);
      expect(service.isTokenExpired(undefined as any)).toBe(true);
    });

    it('should return false for valid non-expired token', () => {
      // Create a token that expires in 1 hour
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, sub: '123', email: 'test@example.com' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(service.isTokenExpired(mockToken)).toBe(false);
    });

    it('should return true for expired token', () => {
      // Create a token that expired 1 hour ago
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const payload = { exp: pastTime, sub: '123', email: 'test@example.com' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(service.isTokenExpired(mockToken)).toBe(true);
    });

    it('should return true for token expiring exactly now', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const payload = { exp: currentTime, sub: '123', email: 'test@example.com' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(service.isTokenExpired(mockToken)).toBe(true);
    });

    it('should return true for malformed token', () => {
      expect(service.isTokenExpired('invalid-token')).toBe(true);
      expect(service.isTokenExpired('not.a.valid.jwt')).toBe(true);
      expect(service.isTokenExpired('header.invalid-base64.signature')).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const payload = { sub: '123', email: 'test@example.com' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(service.isTokenExpired(mockToken)).toBe(true);
    });

    it('should handle token with invalid exp format', () => {
      const payload = { exp: 'not-a-number', sub: '123' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(service.isTokenExpired(mockToken)).toBe(true);
    });
  });

  describe('hasValidAccessToken', () => {
    it('should return true when access token exists and is not expired', () => {
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, sub: '123' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorageMock['access_token'] = mockToken;

      expect(service.hasValidAccessToken()).toBe(true);
    });

    it('should return false when no access token exists', () => {
      expect(service.hasValidAccessToken()).toBe(false);
    });

    it('should return false when access token is expired', () => {
      const pastTime = Math.floor(Date.now() / 1000) - 3600;
      const payload = { exp: pastTime, sub: '123' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;
      localStorageMock['access_token'] = mockToken;

      expect(service.hasValidAccessToken()).toBe(false);
    });

    it('should return false when access token is malformed', () => {
      localStorageMock['access_token'] = 'invalid-token';

      expect(service.hasValidAccessToken()).toBe(false);
    });
  });

  describe('Token Expiration Edge Cases', () => {
    it('should handle token expiring in 1 second', () => {
      const nearFutureTime = Math.floor(Date.now() / 1000) + 1;
      const payload = { exp: nearFutureTime, sub: '123' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(service.isTokenExpired(mockToken)).toBe(false);
    });

    it('should handle token that just expired', () => {
      const justPastTime = Math.floor(Date.now() / 1000) - 1;
      const payload = { exp: justPastTime, sub: '123' };
      const mockToken = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(service.isTokenExpired(mockToken)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle full authentication flow', () => {
      // Initial state: no tokens
      expect(service.hasValidAccessToken()).toBe(false);
      expect(service.getAccessToken()).toBeNull();
      expect(service.getRefreshToken()).toBeNull();

      // Set tokens
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, sub: '123', email: 'test@example.com' };
      const accessToken = `header.${btoa(JSON.stringify(payload))}.signature`;
      const refreshToken = 'refresh-token-value';

      service.setTokens(accessToken, refreshToken);

      // Verify tokens are stored
      expect(service.getAccessToken()).toBe(accessToken);
      expect(service.getRefreshToken()).toBe(refreshToken);
      expect(service.hasValidAccessToken()).toBe(true);

      // Clear tokens
      service.clearTokens();

      // Verify tokens are removed
      expect(service.getAccessToken()).toBeNull();
      expect(service.getRefreshToken()).toBeNull();
      expect(service.hasValidAccessToken()).toBe(false);
    });

    it('should handle token refresh scenario', () => {
      // Set initial tokens
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, sub: '123' };
      const oldAccessToken = `header.${btoa(JSON.stringify(payload))}.signature`;
      const oldRefreshToken = 'old-refresh-token';

      service.setTokens(oldAccessToken, oldRefreshToken);
      expect(service.hasValidAccessToken()).toBe(true);

      // Refresh with new tokens
      const newPayload = { exp: futureTime + 3600, sub: '123' };
      const newAccessToken = `header.${btoa(JSON.stringify(newPayload))}.signature`;
      const newRefreshToken = 'new-refresh-token';

      service.setTokens(newAccessToken, newRefreshToken);

      // Verify new tokens replaced old ones
      expect(service.getAccessToken()).toBe(newAccessToken);
      expect(service.getRefreshToken()).toBe(newRefreshToken);
      expect(service.hasValidAccessToken()).toBe(true);
    });

    it('should handle logout scenario', () => {
      // Login: set tokens
      const futureTime = Math.floor(Date.now() / 1000) + 3600;
      const payload = { exp: futureTime, sub: '123' };
      const accessToken = `header.${btoa(JSON.stringify(payload))}.signature`;
      const refreshToken = 'refresh-token';

      service.setTokens(accessToken, refreshToken);
      expect(service.hasValidAccessToken()).toBe(true);

      // Logout: clear tokens
      service.clearTokens();
      expect(service.hasValidAccessToken()).toBe(false);
      expect(service.getAccessToken()).toBeNull();
      expect(service.getRefreshToken()).toBeNull();
    });
  });
});
