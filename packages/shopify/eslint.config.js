import base from '@xentom/eslint-config/base';

/** @type {import('eslint').Linter.Config} */
export default [...base, { ignores: ['src/generated/*', '.graphqlrc.ts'] }];
