import * as fs from 'fs';
import * as path from 'path';

export async function configurePackageManager(
  registryUrl: string,
  authToken: string
): Promise<string> {
  const workingDirectory = process.env.GITHUB_WORKSPACE;
  if (!workingDirectory) {
    throw new Error('GITHUB_WORKSPACE environment variable is not set');
  }
  const npmrcContent = generateNpmrcContent(registryUrl, authToken);
  const npmrcPath = path.join(workingDirectory, '.npmrc');
  
  try {
    fs.writeFileSync(npmrcPath, npmrcContent, { mode: 0o644 });
  } catch (error) {
    throw new Error(`Failed to write .npmrc: ${error instanceof Error ? error.message : String(error)}`);
  }

  return npmrcContent
}

export function generateNpmrcContent(registryUrl: string, authToken: string): string {
  const registryUrlWithoutProtocol = registryUrl.replace(/^https?:\/\//, '');
  const registryHost = registryUrlWithoutProtocol.split('/')[0];
  
  return `registry=${registryUrl}
//${registryHost}/:_authToken=${authToken}
`;
}


