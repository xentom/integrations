# Xentom Integrations

Welcome to the Xentom Integrations repository!
This repository contains officially supported integrations for the [Xentom Platform](https://xentom.com),
a powerful platform for building and automating workflows across various applications, services, and tools.

![Banner](https://assets.xentom.com/images/integrations/banner.png)

## Overview

The Xentom Platform allows you to create custom workflows by connecting different applications and services,
enabling seamless automation for a wide variety of use cases. In this repository, you'll find integrations
that expand Xentom's capabilities by connecting it with third-party services, allowing users to create more
powerful and versatile workflows.

## Repository Structure

Each integration is organized into its own directory, containing all relevant files, documentation,
and code necessary for its use. The basic structure of the repository is as follows:

```bash
/packages/integration-name/
  ├── assets/               # Static assets for the integration
  ├── src/                  # Source code for the integration
  │   ├── nodes/            # Definitions and logic for workflow nodes
  │   ├── pins/             # Definitions and logic for workflow pins
  │   └── index.ts          # Entry point for the integration
  ├── package.json          # Package configuration for the integration
  ├── CHANGELOG.md          # Changelog for the integration
  └── README.md             # Documentation for the specific integration
```

## Contributing

We welcome contributions from the community! If you have an integration you'd like to add to the repository,
please follow the guidelines outlined in [CONTRIBUTING.md](CONTRIBUTING.md). We appreciate your help in
expanding the capabilities of the Xentom Platform and making it even more powerful and versatile.

## License

This repository is licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for the full license text.

## Support

For any issues, questions, or requests, please open an issue on the [GitHub Issues page](https://github.com/xentom/integrations/issues),
or contact our support team at support@xentom.com.

## Resources

- [Xentom](https://xentom.com)
- [Documentation](https://xentom.com/docs/integration)

Happy automating!
