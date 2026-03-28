import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import mailchimp from '@mailchimp/mailchimp_marketing'

import * as nodes from './nodes'
import { type MailchimpClient } from './utils/client'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    mailchimp: MailchimpClient
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description:
        'Enter your Mailchimp API key. You can generate one from your Mailchimp account under Account → Extras → API keys. The key ends with your server prefix (e.g. -us19).',
      placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us19',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.regex(
        /^[a-f0-9]+-[a-z]{2}[0-9]+$/,
        'Invalid Mailchimp API key format. Expected format: <key>-<server> (e.g. abc123-us19).',
      ),
      v.checkAsync(async (token) => {
        const server = token.split('-').pop() ?? ''
        mailchimp.setConfig({ apiKey: token, server })
        try {
          const response = await mailchimp.ping.get()
          return 'health_status' in response
        } catch {
          return false
        }
      }, 'Invalid Mailchimp API key. Please check your key and try again.'),
    ),
  }),

  start(opts) {
    const server = opts.auth.token.split('-').pop() ?? ''
    mailchimp.setConfig({ apiKey: opts.auth.token, server })
    opts.state.mailchimp = mailchimp as unknown as MailchimpClient
  },
})
