/// <reference types="jest" />
import * as core from '@actions/core';
import * as authModule from './auth';

describe('auth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    jest.spyOn(core, 'setFailed').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('getGitHubOIDCToken', () => {
    it('should return OIDC token when ACTIONS_ID_TOKEN_REQUEST_TOKEN is set', () => {
      process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = 'test-token-123';
      const token = authModule.getGitHubOIDCToken();
      expect(token).toBe('test-token-123');
    });

    it('should throw error when ACTIONS_ID_TOKEN_REQUEST_TOKEN is not set', () => {
      delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
      expect(authModule.getGitHubOIDCToken).toThrow('GitHub OIDC token not available');
    });

    it('should throw error when ACTIONS_ID_TOKEN_REQUEST_TOKEN is empty string', () => {
      process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = '';
      expect(authModule.getGitHubOIDCToken).toThrow('GitHub OIDC token not available');
    });
  });

  describe('getGitHubOIDCTokenUrl', () => {
    it('should return token URL when ACTIONS_ID_TOKEN_REQUEST_URL is set', () => {
      process.env.ACTIONS_ID_TOKEN_REQUEST_URL = 'https://token.url';
      const url = authModule.getGitHubOIDCTokenUrl();
      expect(url).toBe('https://token.url');
    });

    it('should throw error when ACTIONS_ID_TOKEN_REQUEST_URL is not set', () => {
      delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
      expect(authModule.getGitHubOIDCTokenUrl).toThrow('GitHub OIDC token request URL not available');
    });
  });
});
