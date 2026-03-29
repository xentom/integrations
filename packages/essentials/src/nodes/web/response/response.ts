import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as pins from '@/pins'

const nodes = i.nodes.group('Web/Responses')

export const createResponse = nodes.pure({
  description: 'Create an HTTP response object.',
  inputs: {
    body: pins.http.body.with({
      description: 'The response body.',
      optional: true,
    }),
    status: i.pins.data({
      description: 'The HTTP status code.',
      schema: v.pipe(v.number(), v.integer()),
      control: i.controls.number({
        default: 200,
      }),
      optional: true,
    }),
    headers: pins.http.headers.with({
      description: 'HTTP headers to include with the response.',
      optional: true,
    }),
  },
  outputs: {
    response: pins.http.response.with({
      description: 'The constructed HTTP response.',
    }),
  },
  run(opts) {
    opts.outputs.response = new Response(
      opts.inputs.body instanceof Blob
        ? opts.inputs.body
        : opts.inputs.body !== undefined
          ? JSON.stringify(opts.inputs.body)
          : undefined,
      {
        status: opts.inputs.status ?? 200,
        headers: opts.inputs.headers,
      },
    )
  },
})

export const responseJson = nodes.pure({
  displayName: 'Response JSON',
  description: 'Parse the body of an HTTP response as JSON.',
  inputs: {
    response: pins.http.response.with({
      description: 'The HTTP response to extract JSON from.',
    }),
  },
  outputs: {
    body: i.pins.data({
      description: 'The parsed JSON body.',
    }),
  },
  async run(opts) {
    opts.outputs.body = await opts.inputs.response.json()
  },
})

export const responseFile = nodes.pure({
  displayName: 'Response File',
  description: 'Extract the body of an HTTP response as a file.',
  inputs: {
    response: pins.http.response.with({
      description: 'The HTTP response to extract a file from.',
    }),
  },
  outputs: {
    file: i.pins.data<File>({
      description: 'The file extracted from the response body.',
    }),
  },
  async run(opts) {
    opts.outputs.file = new File(
      [await opts.inputs.response.arrayBuffer()],
      'file',
      {
        type:
          opts.inputs.response.headers.get('content-type') ??
          'application/octet-stream',
      },
    )
  },
})

export const responseText = nodes.pure({
  displayName: 'Response Text',
  description: 'Extract the body of an HTTP response as plain text.',
  inputs: {
    response: pins.http.response.with({
      description: 'The HTTP response to extract text from.',
    }),
  },
  outputs: {
    text: i.pins.data({
      description: 'The response body as plain text.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    opts.outputs.text = await opts.inputs.response.text()
  },
})
