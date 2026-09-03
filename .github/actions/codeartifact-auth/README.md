# GitHub Actions CodeArtifact Authentication

This GitHub Action provides seamless authentication to AWS CodeArtifact using GitHub OIDC.

## Usage

```yaml
- name: Configure CodeArtifact
  uses: ./.github/actions/codeartifact-auth
  with:
    role-to-assume: arn:aws:iam::123456789:role/github-actions-codeartifact
    region: eu-west-2
    domain: registry-prod
    domain-owner: 904690835784 
    package-manager: npm
```

### Input Parameters

| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `role-to-assume` | Yes | AWS IAM role ARN with CodeArtifact permissions | None |
| `region` | No | AWS region | `eu-west-2` |
| `codeartifact-domain` | No | CodeArtifact domain name | `registry-prod` |
| `codeartifact-repository` | No | CodeArtifact Repository name  | `registry-prod-repo` |
| `codeartifact-domain-owner` | No | AWS account ID that owns the domain | `904690835784` |
| `package-manager` | No | Package manager (`npm` or `pnpm`) | `npm` |

### Output Variables

- `registry-url`: CodeArtifact registry URL
- `auth-token`: Authorization token
- `npmrc-contents`: Assembled CodeArtifact + token

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
      
      - name: Configure CodeArtifact auth
        uses: govuk-once/platform-actions-codeartifact-login/.github/actions/codeartifact-auth@ce0d38a2fb22c5f6bd8b8764a1572fbc080a52d1
        with:
          role-to-assume: arn:aws:iam::01234456789:role/somerole
      
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
