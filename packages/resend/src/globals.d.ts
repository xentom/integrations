/* eslint-disable @typescript-eslint/no-empty-object-type */
import type Integration from './index';
import { type IntegrationState as CustomIntegrationState } from './index';

type IntegrationEnv = typeof Integration.$infer.env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IntegrationEnv {}
  }
}

declare module '@acme/integration' {
  interface IntegrationState extends CustomIntegrationState {}
}
