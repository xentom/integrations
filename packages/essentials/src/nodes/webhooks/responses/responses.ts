import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { responses } from '../webhooks.utils'

const nodes = i.nodes.group('Webhooks/Responses')

export const textWebhookResponse = nodes.callable({
  displayName: 'Webhook Response (Text)',
  description: 'Send a plain text response to the webhook request.',
  inputs: {
    text: i.pins.data({
      control: i.controls.text({
        defaultValue: 'OK',
      }),
    }),
  },
  run(opts) {
    if (!opts.ctx.requestId) {
      throw new Error(
        'This action can only be called within the context of a webhook trigger.',
      )
    }

    responses.emit(
      opts.ctx.requestId,
      new Response(opts.inputs.text, {
        headers: {
          'Content-Type': 'text/plain',
        },
      }),
    )

    return opts.next()
  },
})

export const jsonWebhookResponse = nodes.callable({
  displayName: 'Webhook Response (JSON)',
  description: 'Send a JSON response to the webhook request.',
  inputs: {
    body: i.pins.data({
      control: i.controls.expression({
        defaultValue: '{\n  "message": "OK"\n}',
      }),
    }),
  },
  run(opts) {
    if (!opts.ctx.requestId) {
      throw new Error(
        'This action can only be called within the context of a webhook trigger.',
      )
    }

    responses.emit(opts.ctx.requestId, Response.json(opts.inputs.body))

    return opts.next()
  },
})

export const redirectWebhookResponse = nodes.callable({
  displayName: 'Webhook Response (Redirect)',
  description: 'Redirect the webhook request to a specified URL.',
  inputs: {
    url: i.pins.data({
      displayName: 'Redirect URL',
      description: 'The URL to redirect the request to.',
      schema: v.pipe(v.string(), v.url()),
      control: i.controls.text({
        placeholder: 'https://example.com',
      }),
    }),
  },
  run(opts) {
    if (!opts.ctx.requestId) {
      throw new Error(
        'This action can only be called within the context of a webhook trigger.',
      )
    }

    responses.emit(opts.ctx.requestId, Response.redirect(opts.inputs.url, 302))
    return opts.next()
  },
})
