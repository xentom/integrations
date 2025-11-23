import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { Resend } from 'resend'

import * as nodes from './nodes'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    resend: Resend
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description:
        'Enter your Resend API key, which you can generate from your Resend dashboard: https://resend.com/api-keys',
      placeholder: 're_...',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.startsWith('re_'),
      v.checkAsync(async (token) => {
        const resend = new Resend(token)

        try {
          const { error } = await resend.apiKeys.list()
          if (error) {
            throw new Error(error.message)
          }

          return true
        } catch (error) {
          console.error(
            'Resend API key validation failed:',
            error instanceof Error ? error.message : error,
          )

          return false
        }
      }, 'Invalid Resend API key. Please check your key and permissions.'),
    ),
  }),

  start(opts) {
    opts.state.resend = new Resend(opts.auth.token)
  },
})
