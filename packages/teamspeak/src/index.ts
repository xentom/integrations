import { QueryProtocol, TeamSpeak } from 'ts3-nodejs-library';
import * as v from 'valibot';

import * as acme from '@acme/integration';
import * as actions from './actions';

export default acme.integration({
  actions,

  env: {
    SERVER_IP: acme.env({
      schema: v.pipe(v.string(), v.ip()),
      control: acme.controls.input({
        label: 'TeamSpeak Server IP',
        placeholder: 'Enter the IP address of your TeamSpeak server',
      }),
      defaultValue: '127.0.0.1',
    }),

    SERVER_PORT: acme.env({
      schema: v.pipe(v.string(), v.transform(Number), v.integer()),
      control: acme.controls.input({
        label: 'TeamSpeak Server Port',
        placeholder: 'Enter the port of your TeamSpeak server',
      }),
      defaultValue: 9987,
    }),

    SERVER_QUERY_PORT: acme.env({
      schema: v.pipe(v.string(), v.transform(Number), v.integer()),
      control: acme.controls.input({
        label: 'TeamSpeak Server Query Port',
        placeholder: 'Enter the query port of your TeamSpeak server',
      }),
      defaultValue: 10011,
    }),

    SERVER_QUERY_USERNAME: acme.env({
      schema: v.string(),
      control: acme.controls.input({
        label: 'TeamSpeak Server Query Username',
        placeholder: 'Enter the query username of your TeamSpeak server',
      }),
      defaultValue: 'serveradmin',
    }),

    SERVER_QUERY_PASSWORD: acme.env({
      schema: v.string(),
      control: acme.controls.input({
        label: 'TeamSpeak Server Query Password',
        placeholder: 'Enter the query password of your TeamSpeak server',
      }),
    }),

    NICKNAME: acme.env({
      schema: v.string(),
      control: acme.controls.input({
        label: 'Bot Nickname',
        placeholder: 'Enter the nickname of your bot',
      }),
      defaultValue: 'TeamSpeak Bot',
    }),
  },

  async start({ ctx }) {
    ctx.teamspeak = await TeamSpeak.connect({
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

    ctx.teamspeak.on('ready', () => {
      console.log('TeamSpeak 3 integration is ready!');
    });

    ctx.teamspeak.on('error', (e) => {
      console.error('TeamSpeak 3 integration error:', e);
    });

    await ctx.teamspeak.registerEvent('textprivate');

    ctx.whoami = await ctx.teamspeak.whoami();
  },

  async stop({ ctx }) {
    await ctx.teamspeak.quit();
  },
});
