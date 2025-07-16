import { HTTP_REQUEST_METHODS } from '@/utils/web';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

import { parseRequestBody, responses } from './webhook.utils';

const category = {
  path: ['Webhook'],
} satisfies i.NodeCategory;

export const onWebhook = i.nodes.trigger({
  category,
  inputs: {
    method: i.pins.data({
      description: 'Incoming HTTP request method',
      schema: v.picklist(HTTP_REQUEST_METHODS),
      control: i.controls.select({
        defaultValue: HTTP_REQUEST_METHODS[0],
        options: HTTP_REQUEST_METHODS.map((method) => ({
          value: method,
        })),
      }),
    }),
    authKey: i.pins.data({
      description:
        'A unique identifier for the webhook, used to authenticate and associate incoming requests with the correct configuration in the system. This key must be provided either in the "X-Webhook-Key" HTTP header or as the "webhookKey" query parameter.',
      schema: v.pipe(v.string(), v.minLength(1)),
      control: i.controls.text({
        sensitive: true,
      }),
    }),
  },
  outputs: {
    body: i.pins.data(),
    headers: i.pins.data({
      schema: v.record(v.string(), v.string()),
    }),
  },
  subscribe(opts) {
    console.log(
      `Webhook url registered: ${opts.webhook.url}&webhookKey=${opts.inputs.authKey}`,
    );

    return opts.webhook.subscribe(async (req) => {
      if (req.method !== opts.inputs.method) {
        return;
      }

      const headers = req.headers.toJSON();
      const authKey =
        headers['X-Webhook-Key'] ||
        new URL(req.url).searchParams.get('webhookKey');

      if (authKey !== opts.inputs.authKey) {
        return;
      }

      const body = await parseRequestBody(req, headers);

      const requestId = Bun.randomUUIDv7();
      const promise = new Promise<Response>((resolve) => {
        responses.once(requestId, resolve);
      });

      void opts.next({ headers, body }, { requestId });

      return await promise;
    });
  },
});
