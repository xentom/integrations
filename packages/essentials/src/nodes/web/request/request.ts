import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as pins from '@/pins'

const nodes = i.nodes.group('Web/Requests')

export const requestJson = nodes.pure({
  displayName: 'Request JSON',
  description: 'Parse the body of an HTTP request as JSON.',
  inputs: {
    request: pins.http.request.with({
      description: 'The HTTP request to extract JSON from.',
    }),
  },
  outputs: {
    body: i.pins.data({
      description: 'The parsed JSON body.',
    }),
  },
  async run(opts) {
    opts.outputs.body = await opts.inputs.request.json()
  },
})

export const requestFile = nodes.pure({
  displayName: 'Request File',
  description: 'Extract the body of an HTTP request as a file.',
  inputs: {
    request: pins.http.request.with({
      description: 'The HTTP request to extract a file from.',
    }),
  },
  outputs: {
    file: i.pins.data<File>({
      description: 'The file extracted from the request body.',
    }),
  },
  async run(opts) {
    opts.outputs.file = new File(
      [await opts.inputs.request.arrayBuffer()],
      'file',
      {
        type:
          opts.inputs.request.headers.get('content-type') ??
          'application/octet-stream',
      },
    )
  },
})

export const requestText = nodes.pure({
  displayName: 'Request Text',
  description: 'Extract the body of an HTTP request as plain text.',
  inputs: {
    request: pins.http.request.with({
      description: 'The HTTP request to extract text from.',
    }),
  },
  outputs: {
    text: i.pins.data({
      description: 'The request body as plain text.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    opts.outputs.text = await opts.inputs.request.text()
  },
})
