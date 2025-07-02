import { HTTP_REQUEST_METHODS } from '@/utils/web';
import * as v from 'valibot';

import * as i from '@acme/integration';

const category = {
  path: ['Web'],
} satisfies i.ActionCategory;

export const httpRequest = i.actions.callable({
  category,
  displayName: 'HTTP Request',
  description:
    'Make an HTTP request to a specified URL and return the response data.',
  inputs: {
    method: i.pins.data({
      description: 'HTTP method to use for the request',
      schema: v.picklist(HTTP_REQUEST_METHODS),
      control: i.controls.select({
        defaultValue: HTTP_REQUEST_METHODS[0],
        options: HTTP_REQUEST_METHODS.map((method) => ({
          value: method,
        })),
      }),
    }),
    url: i.pins.data({
      displayName: 'URL',
      description: 'The URL to fetch data from',
      schema: v.pipe(v.string(), v.url()),
      control: i.controls.text({
        placeholder: 'https://example.com',
      }),
    }),
    headers: i.pins.data({
      schema: v.optional(
        v.union([
          v.array(v.tuple([v.string(), v.string()])),
          v.record(v.string(), v.string()),
        ]),
      ),
    }),
    body: i.pins.data({
      schema: v.optional(v.union([v.any(), v.blob(), v.file()])),
    }),
  },
  outputs: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: i.pins.data<any>({
      description: 'Response body from the HTTP request',
    }),
    status: i.pins.data({
      schema: v.number(),
      description: 'HTTP status code of the response',
    }),
    headers: i.pins.data({
      schema: v.record(v.string(), v.string()),
      description: 'HTTP headers returned in the response',
    }),
  },
  async run(opts) {
    const response = await fetch(opts.inputs.url, {
      method: opts.inputs.method,
      headers: opts.inputs.headers,
      body:
        opts.inputs.body instanceof Blob
          ? opts.inputs.body
          : opts.inputs.body
            ? JSON.stringify(opts.inputs.body)
            : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const contentType = response.headers.get('content-type');

    let body;
    switch (contentType?.split(';')[0]) {
      case 'application/json': {
        body = await response.json();
        break;
      }

      case 'text/plain': {
        body = await response.text();
        break;
      }

      default: {
        const filename = opts.inputs.url.split('/').pop() || 'downloaded_file';
        body = new File([await response.arrayBuffer()], filename, {
          type: contentType ?? 'application/octet-stream',
        });
        break;
      }
    }

    return opts.next({
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
    });
  },
});
