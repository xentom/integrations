import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { GoogleGenAI, type Model } from '@google/genai'

import * as nodes from './nodes'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: GoogleGenAI
    models: Model[]
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description:
        'Generate your Gemini API key by visiting: https://aistudio.google.com/apikey',
      placeholder: 'AIza...',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.checkAsync(async (apiKey) => {
        try {
          const client = new GoogleGenAI({ apiKey })
          const pager = await client.models.list({ config: { pageSize: 1 } })
          await pager[Symbol.asyncIterator]().next()
          return true
        } catch {
          return false
        }
      }, 'Invalid Gemini API key. Please check your key and permissions.'),
    ),
  }),

  async start(opts) {
    opts.state.client = new GoogleGenAI({ apiKey: opts.auth.token })

    opts.state.models = []
    const pager = await opts.state.client.models.list()
    for await (const model of pager) {
      opts.state.models.push(model)
    }
  },
})
