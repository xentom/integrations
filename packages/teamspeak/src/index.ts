import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { QueryProtocol, TeamSpeak } from 'ts3-nodejs-library'
import { type Whoami } from 'ts3-nodejs-library/lib/types/ResponseTypes'

import * as nodes from './nodes'

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    teamspeak: TeamSpeak
    whoami: Whoami
  }
}

export default i.integration({
  nodes,

  env: {
    SERVER_IP: i.env({
      schema: v.pipe(v.string(), v.ip()),
      control: i.controls.text({
        label: 'Server IP',
        placeholder: 'Enter the IP address of your TeamSpeak server',
        defaultValue: '127.0.0.1',
      }),
    }),

    SERVER_PORT: i.env({
      schema: v.pipe(v.string(), v.transform(Number), v.integer()),
      control: i.controls.text({
        label: 'Server Port',
        placeholder: 'Enter the port of your TeamSpeak server',
        defaultValue: '9987',
      }),
    }),

    SERVER_QUERY_PORT: i.env({
      schema: v.pipe(v.string(), v.transform(Number), v.integer()),
      control: i.controls.text({
        label: 'Server Query Port',
        placeholder: 'Enter the query port of your TeamSpeak server',
        defaultValue: '10011',
      }),
    }),

    SERVER_QUERY_USERNAME: i.env({
      schema: v.string(),
      control: i.controls.text({
        label: 'Server Query Username',
        placeholder: 'Enter the query username of your TeamSpeak server',
        defaultValue: 'serveradmin',
      }),
    }),

    SERVER_QUERY_PASSWORD: i.env({
      schema: v.string(),
      control: i.controls.text({
        label: 'Server Query Password',
        placeholder: 'Enter the query password of your TeamSpeak server',
        sensitive: true,
      }),
    }),

    NICKNAME: i.env({
      schema: v.string(),
      control: i.controls.text({
        label: 'Nickname',
        placeholder: 'Enter the nickname of your bot',
        defaultValue: 'TeamSpeak Bot',
      }),
    }),
  },

  async start(opts) {
    opts.state.teamspeak = await TeamSpeak.connect({
      protocol: QueryProtocol.RAW,
      host: opts.env.SERVER_IP,
      serverport: opts.env.SERVER_PORT,
      queryport: opts.env.SERVER_QUERY_PORT,
      username: opts.env.SERVER_QUERY_USERNAME,
      password: opts.env.SERVER_QUERY_PASSWORD,
      nickname: opts.env.NICKNAME,
      keepAlive: true,
      keepAliveTimeout: 60,
    })

    await opts.state.teamspeak.registerEvent('textprivate')

    opts.state.whoami = await opts.state.teamspeak.whoami()
  },

  async stop(opts) {
    if (!opts.state.teamspeak) return

    try {
      await opts.state.teamspeak.quit()
    } catch {
      opts.state.teamspeak.forceQuit()
    }
  },
})
