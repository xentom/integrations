import { ApiType, pluckConfig, preset } from '@shopify/api-codegen-preset';
import { type IGraphQLConfig } from 'graphql-config';

export default {
  schema: 'https://shopify.dev/admin-graphql-direct-proxy/2024-07',
  schemaPath: './src/generated/admin.schema.json',
  documents: ['./src/**/*.{ts,tsx}'],
  projects: {
    default: {
      schema: 'https://shopify.dev/admin-graphql-direct-proxy/2024-07',
      documents: ['./src/**/*.{ts,tsx}'],
      extensions: {
        codegen: {
          pluckConfig,
          generates: {
            './src/generated/admin.schema.json': {
              plugins: ['introspection'],
              config: { minify: true },
            },
            './src/generated/admin.types.ts': {
              plugins: ['typescript'],
            },
            './src/generated/admin.generated.ts': {
              preset,
              presetConfig: {
                apiType: ApiType.Admin,
              },
              config: {
                dedupeOperationSuffix: true,
              },
            },
          },
        },
      },
    },
  },
} satisfies IGraphQLConfig;
