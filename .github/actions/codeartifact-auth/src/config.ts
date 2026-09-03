import * as fs from 'fs';
import * as path from 'path';

export async function configurePackageManager(
  packageManager: 'npm' | 'pnpm',
  registryUrl: string,
  authToken: string
): Promise<string> {
  const workingDirectory = process.cwd();
  const npmrcContent = generateNpmrcContent(registryUrl, authToken);
  const npmrcPath = path.join(workingDirectory, '.npmrc');
  
  try {
    fs.writeFileSync(npmrcPath, npmrcContent, { mode: 0o644 });
  } catch (error) {
    throw new Error(`Failed to write .npmrc: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (packageManager === 'pnpm') {
    const pnpmRcContent = generatePnpmRcContent(registryUrl, authToken);
    const pnpmrcFilePath = path.join(workingDirectory, '.pnpmrc');
    try {
      fs.writeFileSync(pnpmrcFilePath, pnpmRcContent, { mode: 0o644 });
    } catch (error) {
      throw new Error(`Failed to write .pnpmrc: ${error instanceof Error ? error.message : String(error)}`);
    }
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

export function generatePnpmRcContent(registryUrl: string, authToken: string): string {
  const registryUrlWithoutProtocol = registryUrl.replace(/^https?:\/\//, '');
  const registryHost = registryUrlWithoutProtocol.split('/')[0];
  
  return `registry=${registryUrl}
//${registryHost}/:_authToken=${authToken}
`;
}
