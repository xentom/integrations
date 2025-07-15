import { QueryProtocol, TeamSpeak } from 'ts3-nodejs-library';
import { type Whoami } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

import * as nodes from './nodes';

export interface IntegrationState {
  teamspeak: TeamSpeak;
  whoami: Whoami;
}

export default i.integration({
  nodes,

  env: {
    SERVER_IP: i.env({
      schema: v.pipe(v.string(), v.ip()),
      control: i.controls.text({
        label: 'TeamSpeak Server IP',
        placeholder: 'Enter the IP address of your TeamSpeak server',
        defaultValue: '127.0.0.1',
      }),
    }),

    SERVER_PORT: i.env({
      schema: v.pipe(v.string(), v.transform(Number), v.integer()),
      control: i.controls.text({
        label: 'TeamSpeak Server Port',
        placeholder: 'Enter the port of your TeamSpeak server',
        defaultValue: '9987',
      }),
    }),

    SERVER_QUERY_PORT: i.env({
      schema: v.pipe(v.string(), v.transform(Number), v.integer()),
      control: i.controls.text({
        label: 'TeamSpeak Server Query Port',
        placeholder: 'Enter the query port of your TeamSpeak server',
        defaultValue: '10011',
      }),
    }),

    SERVER_QUERY_USERNAME: i.env({
      schema: v.string(),
      control: i.controls.text({
        label: 'TeamSpeak Server Query Username',
        placeholder: 'Enter the query username of your TeamSpeak server',
        defaultValue: 'serveradmin',
      }),
    }),

    SERVER_QUERY_PASSWORD: i.env({
      schema: v.string(),
      control: i.controls.text({
        label: 'TeamSpeak Server Query Password',
        placeholder: 'Enter the query password of your TeamSpeak server',
      }),
    }),

    NICKNAME: i.env({
      schema: v.string(),
      control: i.controls.text({
        label: 'Bot Nickname',
        placeholder: 'Enter the nickname of your bot',
        defaultValue: 'TeamSpeak Bot',
      }),
    }),
  },

  async start(opts) {
    console.log('Starting TeamSpeak 3 integration...');

    opts.state.teamspeak = await TeamSpeak.connect({
      protocol: QueryProtocol.RAW,
      host: process.env.SERVER_IP,
      serverport: process.env.SERVER_PORT,
      queryport: process.env.SERVER_QUERY_PORT,
      username: process.env.SERVER_QUERY_USERNAME,
      password: process.env.SERVER_QUERY_PASSWORD,
      nickname: process.env.NICKNAME,
      keepAlive: true,
      keepAliveTimeout: 60,
    });

    opts.state.teamspeak.on('ready', () => {
      console.log('TeamSpeak 3 integration is ready!');
    });

    opts.state.teamspeak.on('error', (e) => {
      console.error('TeamSpeak 3 integration error:', e);
    });

    await opts.state.teamspeak.registerEvent('textprivate');

    opts.state.whoami = await opts.state.teamspeak.whoami();

    console.log('TeamSpeak 3 integration started.');
  },

  async stop(opts) {
    console.log('Stopping TeamSpeak 3 integration...');
    try {
      await opts.state.teamspeak.quit();
    } catch {
      console.log('Force quitting TeamSpeak 3 integration...');
      opts.state.teamspeak.forceQuit();
    } finally {
      console.log('TeamSpeak 3 integration stopped.');
    }
  },
});
