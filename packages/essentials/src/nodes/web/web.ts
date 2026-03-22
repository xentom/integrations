import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Web')

export const fetch = nodes.callable({
  description:
    'Make an HTTP request to a specified URL and return the response.',
  inputs: {
    url: pins.http.url.with({
      description: 'The target URL endpoint to send the HTTP request to.',
    }),
    method: pins.http.method.with({
      description: 'HTTP method for the request.',
      optional: true,
    }),
    headers: pins.http.headers.with({
      description:
        'HTTP headers to include with the request as key-value pairs.',
      optional: true,
    }),
    body: pins.http.body.with({
      description:
        'Request payload data to send in the request body. Typically JSON for POST/PUT requests, ignored for GET/HEAD/OPTIONS requests.',
      optional: true,
    }),
  },
  outputs: {
    response: pins.http.response.with({
      description: 'The HTTP response.',
    }),
  },
  async run(opts) {
    const method = opts.inputs.method ?? 'GET'

    const response = await globalThis.fetch(opts.inputs.url, {
      method,
      headers: opts.inputs.headers,
      body:
        !['GET', 'HEAD', 'OPTIONS'].includes(method) &&
        opts.inputs.body !== undefined
          ? opts.inputs.body instanceof Blob
            ? opts.inputs.body
            : JSON.stringify(opts.inputs.body)
          : undefined,
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return opts.next({ response })
  },
})
