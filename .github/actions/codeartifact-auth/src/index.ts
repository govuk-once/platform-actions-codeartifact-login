import * as core from '@actions/core';
import { authenticateWithOIDCToken } from './auth';
import { getCodeArtifactTokenAndUrl } from './codeartifact';
import { configurePackageManager } from './config';

export interface ActionInputs {
  packageManager: 'npm' | 'pnpm';
  codeartifactDomain: string;
  codeartifactDomainOwner: string;
  awsRegion: string;
  roleToAssume: string;
}

function parseInputs(): ActionInputs {
  const packageManagerInput = core.getInput('package-manager', { required: false });
  const packageManager = packageManagerInput === 'pnpm' ? 'pnpm' : 'npm';
  
  const awsRegion = core.getInput('aws-region', { required: false });
  
  return {
    packageManager,
    codeartifactDomain: core.getInput('codeartifact-domain', { required: false }) || 'registry-prod',
    codeartifactDomainOwner: core.getInput('codeartifact-domain-owner', { required: true }),
    awsRegion: awsRegion || 'eu-west-2',
    roleToAssume: core.getInput('role-to-assume', { required: true })
  };
}

async function run(): Promise<void> {
  try {
    const inputs = parseInputs();
    
    core.info(`Authenticating with CodeArtifact domain: ${inputs.codeartifactDomain}`);
    core.info(`Using AWS region: ${inputs.awsRegion}`);
    
    const awsCredentials = await authenticateWithOIDCToken(inputs.roleToAssume, inputs.awsRegion);
    core.info('Successfully obtained AWS credentials via OIDC');
    
    const { authToken, registryUrl } = await getCodeArtifactTokenAndUrl(
      inputs.codeartifactDomain,
      inputs.codeartifactDomainOwner,
      awsCredentials,
      inputs.awsRegion
    );
    core.info(`Successfully obtained CodeArtifact token and registry URL: ${registryUrl.substring(0, 8)}...`);
    
    await configurePackageManager(inputs.packageManager, registryUrl, authToken);
    core.info(`Successfully configured ${inputs.packageManager} authentication`);
    
    core.setOutput('registry-url', registryUrl);
    core.setOutput('auth-token', authToken.substring(0, 8) + '...');
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    core.setFailed(`CodeArtifact authentication failed: ${errorMessage}`);
  }
}

run();
