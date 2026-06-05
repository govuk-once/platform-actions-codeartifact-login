# GitHub Actions CodeArtifact Authentication

This GitHub Action provides seamless authentication to AWS CodeArtifact using GitHub OIDC.

## Usage

```yaml
- name: Configure CodeArtifact
  uses: govuk-once/platform-actions/.github/actions/codeartifact-auth@717aab3ceeeea67948259bd6fe54d75be065b58a 
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-codeartifact
    package-manager: pnpm
```

### Input Parameters

| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `role-to-assume` | Yes | AWS IAM role ARN with CodeArtifact permissions | None |
| `aws-region` | No | AWS region | `eu-west-2` |
| `codeartifact-domain` | No | CodeArtifact domain name | `registry-prod` |
| `codeartifact-domain-owner` | Yes | AWS account ID that owns the domain | None |
| `package-manager` | No | Package manager (`npm` or `pnpm`) | `npm` |

### Output Variables

- `registry-url`: CodeArtifact registry URL
- `auth-token`: Authorization token (truncated for security)

## Setup

### Add to your workflow

```yaml
name: CI

on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          registry-url: 'https://repo-prod-904690835784.d.codeartifact.eu-west-2.amazonaws.com/npm/registry-prod-repo/'
      
      - name: Configure CodeArtifact
        uses: govuk-once/platform-actions/.github/actions/codeartifact-auth@717aab3ceeeea67948259bd6fe54d75be065b58a 
        with:
          role-to-assume: ${{ secrets.GH_DEPLOYER_ROLE }}
      
      - name: Install dependencies
        run: npm ci
```

## Development

```bash
cd .github/actions/codeartifact-auth

npm install
npm run build
npm test
npm run lint
```
