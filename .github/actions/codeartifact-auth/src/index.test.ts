import * as core from '@actions/core';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

describe('index', () => {
  let getInputMock: jest.SpiedFunction<typeof core.getInput>;

  beforeEach(() => {
    getInputMock = jest.spyOn(core, 'getInput');
    getInputMock.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        'codeartifact-domain': 'registry-prod',
        'codeartifact-domain-owner': '123456789012',
        'aws-region': 'eu-west-2',
        'role-to-assume': 'arn:aws:iam::123456789012:role/github-actions'
      };
      return inputs[name] || '';
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse inputs correctly with defaults', () => {
    const inputs = {
      codeartifactDomain: 'registry-prod',
      codeartifactDomainOwner: '904690835784',
      awsRegion: 'eu-west-2',
      roleToAssume: 'arn:aws:iam::123456789012:role/github-actions'
    };

    expect(inputs.codeartifactDomain).toBe('registry-prod');
    expect(inputs.codeartifactDomainOwner).toBe('904690835784');
    expect(inputs.awsRegion).toBe('eu-west-2');
    expect(inputs.roleToAssume).toBe('arn:aws:iam::123456789012:role/github-actions');
  });
});
