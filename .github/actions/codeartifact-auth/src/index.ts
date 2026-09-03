import * as core from '@actions/core';
import { authenticateWithOIDCToken } from './auth';
import { getCodeArtifactTokenAndUrl } from './codeartifact';
import { configurePackageManager } from './config';

export interface ActionInputs {
  codeartifactDomain: string;
  codeartifactRepository: string;
  codeartifactDomainOwner: string;
  awsRegion: string;
  roleToAssume: string;
}

function parseInputs(): ActionInputs {
  const awsRegion = core.getInput('aws-region', { required: false });
  
  return {
    codeartifactDomain: core.getInput('codeartifact-domain', { required: false }) || 'registry-prod',
    codeartifactRepository: core.getInput('codeartifact-repository', { required: false }) || 'npm',
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
    const idToken = await core.getIDToken('sts.amazonaws.com');
    const awsCredentials = await authenticateWithOIDCToken(idToken, inputs.roleToAssume, inputs.awsRegion);
    core.info('Successfully obtained AWS credentials via OIDC');
    
    const { authToken, registryUrl } = await getCodeArtifactTokenAndUrl(
      inputs.codeartifactDomain,
      inputs.codeartifactRepository,
      inputs.codeartifactDomainOwner,
      awsCredentials,
      inputs.awsRegion
    );
  
    core.info(`Successfully obtained CodeArtifact token and registry URL: ${registryUrl.substring(0, 8)}...`);
    
    const npmrcContents = await configurePackageManager(registryUrl, authToken);
    core.info('Successfully configured CodeArtifact authentication');
    
    core.setOutput('registry-url', registryUrl);
    core.setOutput('auth-token', authToken);
    core.setOutput('npmrc-contents', npmrcContents)
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    core.setFailed(`CodeArtifact authentication failed: ${errorMessage}`);
  }
}

run();
