import { type TeamSpeak } from 'ts3-nodejs-library';
import { type Whoami } from 'ts3-nodejs-library/lib/types/ResponseTypes';
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
    teamspeak: TeamSpeak;
    whoami: Whoami;
  }
}
