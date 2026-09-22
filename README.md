# CodeArtifact onboarding documentation

Guides for using the private npm registry hosted on AWS CodeArtifact.

[auth-tldr]: ./docs/authentication-setup.mdx?tldr

## Documentation

| Guide                                              | Description                                           |
|----------------------------------------------------|-------------------------------------------------------|
| [Overview][overview]                                 | What CodeArtifact is and why we use it                 |
| [Prerequisites][prerequisites]                       | Software and permissions required before you start     |
| [Authentication setup][authentication]               | Log in from your machine using `gds-cli`               |
| [Configure pnpm][configure-pnpm]                      | Point pnpm at the private registry                     |
| [Publishing packages][publishing]                      | Create and publish a package to the registry           |
| [Consuming packages][consuming]                        | Install and use packages from the registry             |
| [Troubleshooting][troubleshooting]                     | Fix common errors with the registry                    |

[overview]: ./docs/onboarding-overview.mdx
[prerequisites]: ./docs/onboarding-prerequisites.mdx
[authentication]: ./docs/authentication-setup.mdx
[configure-pnpm]: ./docs/configure-pnpm.mdx
[publishing]: ./docs/publishing-packages.mdx
[consuming]: ./docs/consuming-packages.mdx
[troubleshooting]: ./docs/troubleshooting.mdx


## Quick start

1. Install [Node.js](https://nodejs.org/) (LTS) and [pnpm](https://pnpm.io/installation) on your machine.
2. Follow the [Prerequisites][prerequisites] guide.
3. Run the [TL;DR][auth-tldr] command in your terminal to authenticate.
4. `pnpm install` and start building.

[auth-tldr]: ./docs/authentication-setup.mdx?tldr
