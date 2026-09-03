import * as configModule from './config';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

describe('config', () => {
  const originalGws = process.env.GITHUB_WORKSPACE;

  beforeEach(() => {
    process.env.GITHUB_WORKSPACE = '/tmp/test';
  });

  afterEach(() => {
    process.env.GITHUB_WORKSPACE = originalGws;
    jest.clearAllMocks();
  });

  describe('generateNpmrcContent', () => {
    it('should generate correct npmrc content with protocol', () => {
      const registryUrl = 'https://registry.example.com';
      const authToken = 'auth-token-123';
      const content = configModule.generateNpmrcContent(registryUrl, authToken);

      expect(content).toContain('//registry.example.com/:_authToken=auth-token-123');
      expect(content).toContain('registry=https://registry.example.com');
    });

    it('should generate correct npmrc content without protocol', () => {
      const registryUrl = 'http://registry.example.com';
      const authToken = 'token-with-special-chars!@#$';
      const content = configModule.generateNpmrcContent(registryUrl, authToken);

      expect(content).toContain('//registry.example.com/:_authToken=token-with-special-chars!@#$');
      expect(content).toContain('registry=http://registry.example.com');
    });

    it('should append trailing newline', () => {
      const registryUrl = 'https://registry.example.com';
      const authToken = 'token123';
      const content = configModule.generateNpmrcContent(registryUrl, authToken);

      expect(content).toMatch(/\n$/);
    });
  });

});
