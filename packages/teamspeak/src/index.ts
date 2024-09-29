import { QueryProtocol, TeamSpeak } from 'ts3-nodejs-library';
import { type Whoami } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { createIntegration, env } from '@xentom/integration';
import * as actions from './actions';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_IP: string;
      SERVER_PORT?: string;
      SERVER_QUERY_PORT?: string;
      SERVER_QUERY_USERNAME?: string;
      SERVER_QUERY_PASSWORD: string;
      NICKNAME: string;
    }
  }
}

declare module '@xentom/integration' {
  interface IntegrationState {
    ts: TeamSpeak;
    whoami: Whoami;
  }
}

export default createIntegration({
  actions,

  env: {
    SERVER_IP: env.string({
      label: 'Server IP',
      description: 'The IP address of the TeamSpeak 3 server',
      defaultValue: '127.0.0.1',
    }),
    SERVER_PORT: env.number({
      label: 'Server Port',
      description: 'The port of the TeamSpeak 3 server',
      defaultValue: 9987,
    }),
    SERVER_QUERY_PORT: env.number({
      label: 'Server Query Port',
      description: 'The server query port of the TeamSpeak 3 server',
      defaultValue: 10011,
    }),
    SERVER_QUERY_USERNAME: env.string({
      label: 'Server Query Username',
      description: 'The server query username of the TeamSpeak 3 server',
      defaultValue: 'serveradmin',
    }),
    SERVER_QUERY_PASSWORD: env.string({
      label: 'Server Query Password',
      description: 'The server query password of the TeamSpeak 3 server',
      isSensitive: true,
    }),
    NICKNAME: env.string({
      label: 'Bot Nickname',
      description: 'The nickname of the bot',
      defaultValue: 'Bot',
    }),
  },

  async onStart({ state }) {
    try {
      state.ts = await TeamSpeak.connect({
        host: process.env.SERVER_IP,
        protocol: QueryProtocol.RAW,
        queryport: parseInt(process.env.SERVER_QUERY_PORT ?? '10011'),
        serverport: parseInt(process.env.SERVER_PORT ?? '9987'),
        username: process.env.SERVER_QUERY_USERNAME,
        password: process.env.SERVER_QUERY_PASSWORD,
        nickname: process.env.NICKNAME,
        keepAlive: true,
        keepAliveTimeout: 60,
      });

      state.ts.on('ready', () => {
        console.log('TeamSpeak 3 integration is ready!');
      });

      state.ts.on('error', (e) => {
        console.error('TeamSpeak 3 integration error:', e);
      });

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      state.ts.on('close', async (error) => {
        console.error(
          `TeamSpeak 3 integration disconnected${error ? ` (${error.message})` : ''}, trying to reconnect...`,
        );

        await state.ts.reconnect(-1, 1000);
        console.log('TeamSpeak 3 integration reconnected!');
      });

      await Promise.all([state.ts.registerEvent('textprivate')]);
    } catch (e) {
      console.error(
        'Failed to establish connection to TeamSpeak 3 server:',
        e instanceof Error ? e.message : e,
      );

      throw e;
    }

    state.whoami = await state.ts.whoami();
  },

  async onStop({ state }) {
    console.log('Disconnecting from TeamSpeak 3 server...');
    await state.ts.quit();
  },
});
