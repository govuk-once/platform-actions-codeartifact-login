import {
  CodeartifactClient,
  GetAuthorizationTokenCommand,
  GetRepositoryEndpointCommand
} from '@aws-sdk/client-codeartifact';
import { AwsCredentials } from './auth';

export interface CodeArtifactCredentials {
  authToken: string;
  registryUrl: string;
}

export async function getCodeArtifactTokenAndUrl(
  domain: string,
  domainOwner: string,
  credentials: AwsCredentials,
  region: string
): Promise<CodeArtifactCredentials> {
  const codeartifactClient = new CodeartifactClient({
    region,
    maxAttempts: 3,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken
    }
  });

  const tokenCommand = new GetAuthorizationTokenCommand({
    domain,
    domainOwner,
    durationSeconds: 900
  });
  
  const tokenResponse = await codeartifactClient.send(tokenCommand);
  
  if (!tokenResponse.authorizationToken) {
    throw new Error('Failed to obtain Code Artifact authorization token');
  }

  const endpointCommand = new GetRepositoryEndpointCommand({
    domain,
    domainOwner,
    repository: 'npm',
    format: 'npm'
  });

  const endpointResponse = await codeartifactClient.send(endpointCommand);
  
  if (!endpointResponse.repositoryEndpoint) {
    throw new Error('Failed to obtain Code Artifact repository endpoint');
  }

  return {
    authToken: tokenResponse.authorizationToken,
    registryUrl: endpointResponse.repositoryEndpoint
  };
}
