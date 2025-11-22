# Contributing to Xentom Official Integrations

Thank you for your interest in contributing to the Xentom Official Integrations!
We appreciate your help in improving the Xentom platform and its integrations.
This guide outlines how you can get involved and contribute to the project.

## How to Contribute

### 1. Fork the Repository

First, fork the repository to your GitHub account to make your changes without affecting the main codebase.

### 2. Clone the Fork

Clone your forked repository to your local machine:

```bash
git clone https://github.com/xentom/integrations.git
cd integrations
```

### 3. Create a Branch

Create a new branch for your feature or bug fix. It’s good practice to use a descriptive name for your branch:

```bash
git checkout -b feature/my-new-feature
```

### 4. Make Changes

Make your changes in the relevant directory. Be sure to follow the repository's structure and coding standards.

- **Integrations**: Add new integrations under `/packages/`.
- **Nodes and Pins**: Place all node logic in the `src/nodes/` folder and pin definitions in the `src/pins/` folder.
- **Documentation**: If your change affects how an integration works, update the `README.md` in the integration folder.

### 5. Commit Your Changes

Once your changes are ready, commit them with a clear and descriptive commit message:

```bash
git add .
git commit -m "Add feature X to integration Y"
```

### 6. Push Your Changes

Push your changes to your forked repository:

```bash
git push origin feature/my-new-feature
```

### 7. Submit a Pull Request

Go to the [original repository](https://github.com/xentom/integrations) on GitHub, and submit a Pull Request (PR) from your branch.
Provide a clear description of what you've changed and why.

### 8. Review Process

Your PR will be reviewed by one of the maintainers. They may request changes or provide feedback, so please be responsive.
Once approved, your contribution will be merged into the main branch.

## Code Style Guidelines

- **Consistency**: Follow the existing coding style. If you’re unsure, review the existing code to understand naming conventions, file structure, and formatting.
- **Comments**: Use clear, concise comments to explain complex code or logic where necessary.
- **Documentation**: Ensure that any new features or updates are reflected in the relevant `README.md` and examples, if applicable.

## Bug Reports and Feature Requests

If you find a bug or have an idea for a new feature, please open an issue in the [GitHub Issues](https://github.com/xentom/integrations/issues) section.
When reporting a bug, provide as much detail as possible, including:

- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Relevant logs or error messages

## Thank You

Your contributions help make the Xentom Platform better, and we sincerely appreciate your effort and time.
Whether it's reporting a bug, suggesting a feature, or writing code, every bit of help is valuable!

Happy coding!
