import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as pins from '../../pins'

const nodes = i.nodes.group('Drafts')

export const createDraft = nodes.callable({
  description: 'Create a new draft email in Gmail',
  inputs: {
    to: pins.message.addresses,
    subject: pins.message.subject.with({
      optional: true,
    }),
    body: pins.message.body.with({
      optional: true,
    }),
    cc: pins.message.cc.with({
      optional: true,
    }),
    bcc: pins.message.bcc.with({
      optional: true,
    }),
  },
  outputs: {
    draft: pins.draft.item,
  },
  async run(opts) {
    const headers = [
      `To: ${opts.inputs.to.join(', ')}`,
      `Subject: ${opts.inputs.subject}`,
    ]

    if (opts.inputs.cc?.length) {
      headers.push(`Cc: ${opts.inputs.cc.join(', ')}`)
    }

    if (opts.inputs.bcc?.length) {
      headers.push(`Bcc: ${opts.inputs.bcc.join(', ')}`)
    }

    const content = [...headers, '', opts.inputs.body ?? ''].join('\r\n')
    const response = await opts.state.gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: Buffer.from(content).toString('base64url'),
        },
      },
    })

    return opts.next({
      draft: response.data,
    })
  },
})

export const sendDraft = nodes.callable({
  description: 'Send an existing draft email',
  inputs: {
    id: pins.draft.id,
  },
  outputs: {
    message: pins.message.item,
  },
  async run(opts) {
    const response = await opts.state.gmail.users.drafts.send({
      userId: 'me',
      requestBody: {
        id: opts.inputs.id,
      },
    })

    return opts.next({
      message: response.data,
    })
  },
})

export const getDraft = nodes.callable({
  description: 'Retrieve a specific draft by ID',
  inputs: {
    id: pins.draft.id,
  },
  outputs: {
    draft: pins.draft.item,
  },
  async run(opts) {
    const response = await opts.state.gmail.users.drafts.get({
      userId: 'me',
      id: opts.inputs.id,
    })

    return opts.next({
      draft: response.data,
    })
  },
})

export const listDrafts = nodes.callable({
  description: 'Retrieve all draft emails',
  inputs: {
    maxResults: pins.query.maxResults.with({
      description: 'Maximum number of drafts to return',
      optional: true,
    }),
  },
  outputs: {
    drafts: i.pins.data({
      displayName: 'Drafts',
      schema: v.array(v.any()),
    }),
    resultSizeEstimate: i.pins.data({
      displayName: 'Total Results',
      schema: v.number(),
    }),
  },
  async run(opts) {
    const response = await opts.state.gmail.users.drafts.list({
      userId: 'me',
      maxResults: opts.inputs.maxResults,
    })

    return opts.next({
      drafts: response.data.drafts ?? [],
      resultSizeEstimate: response.data.resultSizeEstimate ?? 0,
    })
  },
})

export const deleteDraft = nodes.callable({
  description: 'Delete a draft email',
  inputs: {
    id: pins.draft.id,
  },
  async run(opts) {
    await opts.state.gmail.users.drafts.delete({
      userId: 'me',
      id: opts.inputs.id,
    })
  },
})
