import * as i from '@xentom/integration-framework'

import { type BodyInit } from 'bun'

import * as pins from '@/pins'

const nodes = i.nodes.group('Web')

export const request = nodes.callable({
  description:
    'Make an HTTP request to a specified URL and return the response data.',
  inputs: {
    url: pins.http.url.with({
      description: 'The target URL endpoint to send the HTTP request to',
    }),
    method: pins.http.method.with({
      description: 'HTTP method for the request',
      optional: true,
    }),
    headers: pins.http.headers.with({
      description:
        'HTTP headers to include with the request as key-value pairs',
      optional: true,
    }),
    body: pins.http.body.with({
      description:
        'Request payload data to send in the request body. Typically JSON for POST/PUT requests, ignored for GET/HEAD/OPTIONS requests',
      optional: true,
    }),
  },
  outputs: {
    response: pins.http.response,
  },
  async run(opts) {
    const requestMethod = opts.inputs.method ?? 'GET'

    let requestBody: BodyInit | null | undefined
    if (
      !['GET', 'HEAD', 'OPTIONS'].includes(requestMethod) &&
      opts.inputs.body !== undefined
    ) {
      if (opts.inputs.body instanceof Blob) {
        requestBody = opts.inputs.body
      } else {
        requestBody = JSON.stringify(opts.inputs.body)
      }
    }

    const response = await fetch(opts.inputs.url, {
      method: requestMethod,
      headers: opts.inputs.headers,
      body: requestBody,
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const contentType = response.headers.get('content-type')

    let responseBody: unknown
    switch (contentType?.split(';')[0]) {
      case 'application/json': {
        responseBody = await response.json()
        break
      }

      case 'text/plain': {
        responseBody = await response.text()
        break
      }

      default: {
        const filename = opts.inputs.url.split('/').pop() || 'downloaded_file'
        responseBody = new File([await response.arrayBuffer()], filename, {
          type: contentType ?? 'application/octet-stream',
        })
        break
      }
    }

    return opts.next({
      response: {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseBody,
      },
    })
  },
})
