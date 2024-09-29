import { Client, GatewayIntentBits, REST } from 'discord.js';
import { createIntegration, env } from '@xentom/integration';
import * as actions from './actions';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPLICATION_ID: string;
      TOKEN: string;
    }
  }
}

declare module '@xentom/integration' {
  interface IntegrationState {
    rest: REST;
    client: Client<true>;
  }
}

export default createIntegration({
  actions,

  env: {
    APPLICATION_ID: env.string({
      label: 'Application ID',
      description: 'The Discord application ID',
    }),
    TOKEN: env.string({
      description: 'The Discord bot token',
      isSensitive: true,
    }),
  },

  onStart({ state }) {
    if (!process.env.APPLICATION_ID) {
      throw new Error('APPLICATION_ID is required');
    }

    if (!process.env.TOKEN) {
      throw new Error('TOKEN is required');
    }

    state.rest = new REST({
      version: '10',
    }).setToken(process.env.TOKEN);

    state.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
      ],
    });

    state.client.login(process.env.TOKEN);
    state.client.on('ready', () => {
      console.log(`Discord client ready as ${state.client.user.tag}`);
    });
  },

  async onStop({ state }) {
    await state.client.destroy();
  },
});
