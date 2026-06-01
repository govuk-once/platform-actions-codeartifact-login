import * as configModule from './config';

describe('config', () => {
  const originalCwd = process.cwd;

  beforeEach(() => {
    process.cwd = jest.fn(() => '/tmp/test');
  });

  afterEach(() => {
    process.cwd = originalCwd;
    jest.clearAllMocks();
  });

  describe('generateNpmrcContent', () => {
    it('should generate correct npmrc content with protocol', () => {
      const registryUrl = 'https://registry.example.com';
      const authToken = 'auth-token-123';
      const content = configModule.generateNpmrcContent(registryUrl, authToken);

      expect(content).toContain('registry.example.com:_authToken=auth-token-123');
    });

    it('should generate correct npmrc content without protocol', () => {
      const registryUrl = 'http://registry.example.com';
      const authToken = 'token-with-special-chars!@#$';
      const content = configModule.generateNpmrcContent(registryUrl, authToken);

      expect(content).toContain('registry.example.com:_authToken=token-with-special-chars!@#$');
    });

    it('should append trailing newline', () => {
      const registryUrl = 'https://registry.example.com';
      const authToken = 'token123';
      const content = configModule.generateNpmrcContent(registryUrl, authToken);

      expect(content).toMatch(/\n$/);
    });
  });

  describe('generatePnpmRcContent', () => {
    it('should generate correct pnpmrc content', () => {
      const registryUrl = 'https://registry.example.com';
      const content = configModule.generatePnpmRcContent(registryUrl);

      expect(content).toContain('registry=');
    });

    it('should append trailing newline', () => {
      const registryUrl = 'https://registry.example.com';
      const content = configModule.generatePnpmRcContent(registryUrl);

      expect(content).toMatch(/\n$/);
    });
  });
});
