import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import Stripe from 'stripe'

import * as nodes from './nodes'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    stripe: Stripe
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description:
        'Enter your Stripe API key, which you can find in your Stripe dashboard: https://dashboard.stripe.com/apikeys',
      placeholder: 'sk_...',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.regex(
        /^sk_(test|live)_/,
        'API key must start with sk_test_ or sk_live_',
      ),
      v.checkAsync(async (token) => {
        const stripe = new Stripe(token)

        try {
          await stripe.balance.retrieve()
          return true
        } catch (error) {
          console.error(
            'Stripe API key validation failed:',
            error instanceof Error ? error.message : error,
          )
          return false
        }
      }, 'Invalid Stripe API key. Please check your key and permissions.'),
    ),
  }),

  start(opts) {
    opts.state.stripe = new Stripe(opts.auth.token)
  },
})
