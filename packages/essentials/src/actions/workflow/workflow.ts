import { actions, pins } from '@acme/integration';
import * as v from 'valibot';

export const onStart = actions.trigger({
  category: 'Workflow / Triggers',
  subscribe({ next }) {
    next();
  },
});
export const webhookUrl = actions.pure({
  category: 'Workflow / Webhooks',
  displayName: 'Webhook URL',
  outputs: {
    url: pins.data({
      displayName: 'URL',
      schema: v.pipe(v.string(), v.url()),
    }),
  },
  run({ outputs, webhook }) {
    outputs.url = webhook.url;
  },
});
