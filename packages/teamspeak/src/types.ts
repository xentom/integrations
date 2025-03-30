import { type TeamSpeak } from 'ts3-nodejs-library';
import { type Whoami } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import type integration from './index';

declare module '@acme/integration' {
  interface IntegrationContext {
    teamspeak: TeamSpeak;
    whoami: Whoami;
  }
}

type IntegrationEnv = typeof integration.$infer.env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IntegrationEnv {}
  }
}
