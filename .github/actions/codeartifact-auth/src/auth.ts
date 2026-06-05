import { STSClient, AssumeRoleWithWebIdentityCommand } from '@aws-sdk/client-sts';

export interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken: string;
  expiration: Date;
}

const OIDC_TOKEN_DURATION_SECONDS = 3600;

export function getGitHubOIDCToken(): string {
  const token = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  if (!token) {
    throw new Error(
      'GitHub OIDC token not available. ACTIONS_ID_TOKEN_REQUEST_TOKEN environment variable is missing'
    );
  }
  return token;
}

export function getGitHubOIDCTokenUrl(): string {
  const url = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!url) {
    throw new Error('GitHub OIDC token request URL not available');
  }
  return url;
}

export async function authenticateWithOIDCToken(
  idToken: string,
  roleToAssume: string,
  region: string
): Promise<AwsCredentials> {
  // const oidcToken = getGitHubOIDCToken();
  // getGitHubOIDCTokenUrl();
  
  const stsClient = new STSClient({ 
    region,
    maxAttempts: 3
  });
  
  const command = new AssumeRoleWithWebIdentityCommand({
    RoleArn: roleToAssume,
    RoleSessionName: 'github-actions-codeartifact',
    WebIdentityToken: idToken,
    DurationSeconds: OIDC_TOKEN_DURATION_SECONDS
  });
  console.info(`Assuming role ${roleToAssume} with OIDC token for AWS region ${region}`);
  const response = await stsClient.send(command).catch(e => {
    console.log(atob(idToken.split('.')[0]));
    console.log(atob(idToken.split('.')[1]));
    console.log(e);
    throw e;
  });
  if (!response.Credentials) {
    console.info(response)
    throw new Error('Failed to obtain AWS credentials: no credentials returned');
  }
  
  return {
    accessKeyId: response.Credentials.AccessKeyId!,
    secretAccessKey: response.Credentials.SecretAccessKey!,
    sessionToken: response.Credentials.SessionToken!,
    expiration: response.Credentials.Expiration!
  };
}
