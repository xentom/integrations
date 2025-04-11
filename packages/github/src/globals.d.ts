import { type Webhooks } from '@octokit/webhooks';
import { type Octokit } from 'octokit';
import type Integration from './index';
import { type IntegrationState as CustomIntegrationState } from './index';

type IntegrationEnv = typeof Integration.$infer.env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IntegrationEnv {}
  }
}

declare module '@acme/integration' {
  interface IntegrationState {
    webhooks: Webhooks;
    webhookSecret: string;
    octokit: Octokit;
  }
}
