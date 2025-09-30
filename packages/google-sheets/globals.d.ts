/* eslint-disable @typescript-eslint/no-empty-object-type */
/**
 * NOTE: This file should NOT be edited manually.
 *
 * @generated
 */

import type Integration from './src';
import { type IntegrationState as CustomIntegrationState } from './src';

type IntegrationEnv = typeof Integration.$infer.env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IntegrationEnv {}
  }
}

declare module '@xentom/integration-framework' {
  interface IntegrationState extends CustomIntegrationState {}
}
