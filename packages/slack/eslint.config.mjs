import baseConfig from '@xentom/style-guide/eslint/base';

import { defineConfig } from 'eslint/config';

export default defineConfig(baseConfig, {
  rules: {
    '@typescript-eslint/no-misused-promises': 'off',
  },
});
