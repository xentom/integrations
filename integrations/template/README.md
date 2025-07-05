# {{ name }} Integration

Welcome to your new **{{ name }}** integration! 🎉

This integration was scaffolded using the Acme CLI and is ready for development. You can now build powerful workflows and automations that connect {{ name }} with other services in the ecosystem.

## 🚀 Quick Start

### Development Server

Start the development server to begin building and testing your integration:

```bash
acme dev
```

This will launch the development environment where you can:

- Build and test your integration logic
- See real-time changes as you develop
- Debug workflows and connections
- Test integration endpoints

### Project Structure

```
{{ name }}/
├── src/
│   ├── nodes/
│   │   └── [...categories]/         # Grouped by category (e.g., crm, marketing)
│   │       ├── [category].ts        # Node triggers and actions
│   │       └── index.ts             # Re-exports all nodes in the category
│   └── index.ts                     # Integration entry point
│
├── package.json                     # Project metadata and dependencies
├── CHANGELOG.md                     # Version history and notable changes
└── README.md                        # Overview and setup documentation
```

## 📚 Documentation & Resources

- **[Developer Documentation](https://docs.acme.dev)** - Complete guide to building integrations
- **[API Reference](https://docs.acme.dev/api)** - Detailed API documentation
- **[Examples](https://docs.acme.dev/examples)** - Sample integrations and patterns
- **[Community](https://community.acme.dev)** - Join other developers building integrations

## 🛠️ Development Commands

```
| Command        | Description                            |
| -------------- | -------------------------------------- |
| `acme dev`     | Start the development server           |
| `acme build`   | Build integration for production       |
| `acme pack`    | Package integration for distribution   |
| `acme publish` | Publish integration to the marketplace |
```

## 📝 Next Steps

1. **Configure your integration** - Update `src/index.ts` to define environment variables, integration state, and lifecycle hooks for your integration.
2. **Build your nodes** - Create custom nodes in `src/nodes/` to define the triggers and actions your integration will perform.
3. **Test your integration** - Use `acme dev` to test your nodes and workflows in the development environment.
4. **Publish your integration** - When ready, use `acme publish` to make your integration available to users.

## 🤝 Need Help?

- Check out the [troubleshooting guide](https://acme.com/docs/troubleshooting)
- Browse [frequently asked questions](https://acme.com/docs/faq)
- Join our [developer community](https://community.acme.dev) for support
- Report issues on [GitHub](https://github.com/acme/cli/issues)

---

**Happy building!** 🔨
