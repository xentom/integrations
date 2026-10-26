import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { Client, Events, GatewayIntentBits, Partials } from 'discord.js'

import * as nodes from './nodes'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: Client<true>
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'Bot Token',
      placeholder: 'Enter your Discord bot token',
      sensitive: true,
    }),
    schema: v.pipeAsync(
      v.string(),
      v.trim(),
      v.minLength(1),
      v.checkAsync(async (token) => {
        const response = await fetch('https://discord.com/api/v10/users/@me', {
          headers: { Authorization: `Bot ${token}` },
        })
        return response.ok
      }, 'Invalid Discord bot token.'),
    ),
  }),

  env: {
    DISCORD_INTENTS: i.env({
      control: i.controls.select({
        label: 'Gateway Intents',
        options: [
          { value: 'Guilds', label: 'Guilds' },
          { value: 'GuildMembers', label: 'Guild Members (Privileged)' },
          { value: 'GuildModeration', label: 'Guild Moderation' },
          { value: 'GuildMessages', label: 'Guild Messages' },
          { value: 'GuildMessageReactions', label: 'Message Reactions' },
          { value: 'MessageContent', label: 'Message Content (Privileged)' },
          { value: 'DirectMessages', label: 'Direct Messages' },
        ],
        default: 'Guilds',
      }),
    }),
  },

  async start(opts) {
    const intentName = opts.env
      .DISCORD_INTENTS as keyof typeof GatewayIntentBits
    const intents = [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildModeration,
    ]

    const selected = GatewayIntentBits[intentName]
    if (selected && !intents.includes(selected)) {
      intents.push(selected)
    }

    const client = new Client({
      intents,
      partials: [Partials.Message, Partials.Reaction, Partials.GuildMember],
    })

    await new Promise<void>((resolve, reject) => {
      client.once(Events.ClientReady, () => resolve())
      client.once(Events.Error, reject)
      void client.login(opts.auth.token)
    })

    opts.state.client = client as Client<true>
  },

  async stop(opts) {
    await opts.state.client?.destroy()
  },
})
