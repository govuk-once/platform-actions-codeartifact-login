import * as codeartifactModule from './codeartifact';

const mockCodeartifactClient = {
  send: jest.fn()
};

jest.mock('@aws-sdk/client-codeartifact', () => ({
  CodeartifactClient: jest.fn(() => mockCodeartifactClient),
  GetAuthorizationTokenCommand: jest.fn(),
  GetRepositoryEndpointCommand: jest.fn()
}));

jest.mock('./auth', () => ({
  authenticateWithOIDCToken: jest.fn()
}));

describe('codeartifact', () => {
  describe('getCodeArtifactTokenAndUrl', () => {
    it('should return token and registry url when successful', async () => {
      mockCodeartifactClient.send
        .mockResolvedValueOnce({ authorizationToken: 'mock-auth-token' })
        .mockResolvedValueOnce({ repositoryEndpoint: 'https://registry.codeartifact.example.com/npm/registry-prod/' });

      const domain = 'registry-prod';
      const domainOwner = '123456789012';
      const credentials = {
        accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
        sessionToken: 'token123',
        expiration: new Date()
      };
      const region = 'eu-west-2';

      const result = await codeartifactModule.getCodeArtifactTokenAndUrl(
        domain,
        domainOwner,
        credentials,
        region
      );

      expect(result).toEqual({
        authToken: 'mock-auth-token',
        registryUrl: 'https://registry.codeartifact.example.com/npm/registry-prod/'
      });
    });
  });
});
