import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import * as pins from '@/pins';
import { parseRequestBody, responses } from './webhooks.utils';

const nodes = i.nodes.group('Webhooks');

export const onWebhook = nodes.trigger({
  inputs: {
    method: pins.http.method.with({
      description: 'Incoming HTTP request method',
    }),
    webhookKey: i.pins.data({
      description:
        'A unique identifier for the webhook, used to authenticate and associate incoming requests with the correct configuration in the system. This key must be provided either in the "X-Webhook-Key" HTTP header or as the "webhook-key" query parameter.',
      schema: v.pipe(v.string(), v.minLength(1)),
      control: i.controls.text({
        sensitive: true,
      }),
    }),
    customResponse: i.pins.data({
      description:
        'If enabled, the webhook waits for a custom response before completing. Use this to return a specific status code or response body. To send a custom response, search for "Webhook Response" in the nodes panel.',
      schema: v.boolean(),
      optional: true,
      control: i.controls.switch({
        defaultValue: false,
      }),
    }),
  },
  outputs: {
    request: pins.http.request.with({
      description: 'Incoming HTTP request',
    }),
  },
  subscribe(opts) {
    console.log(
      `Webhook url registered: ${opts.webhook.url}?webhook-key=${opts.inputs.webhookKey}`,
    );

    return opts.webhook.subscribe(async (req) => {
      if (req.method !== opts.inputs.method) {
        return;
      }

      const headers = req.headers.toJSON();
      const webhookKey =
        headers['X-Webhook-Key'] ||
        new URL(req.url).searchParams.get('webhook-key');

      if (webhookKey !== opts.inputs.webhookKey) {
        return;
      }

      const body = await parseRequestBody(req, headers);
      const requestId = Bun.randomUUIDv7();

      if (!opts.inputs.customResponse) {
        void opts.next(
          {
            request: {
              url: req.url,
              method: req.method,
              body,
              headers,
            },
          },
          { requestId },
        );

        return;
      }

      const promise = new Promise<Response>((resolve) => {
        responses.once(requestId, resolve);
      });

      void opts.next(
        {
          request: {
            url: req.url,
            method: req.method,
            body,
            headers,
          },
        },
        { requestId },
      );

      return await Promise.race([
        promise,
        new Promise<Response>((resolve) => {
          setTimeout(() => {
            resolve(new Response('Timeout', { status: 408 }));
          }, 10000);
        }),
      ]);
    });
  },
});
