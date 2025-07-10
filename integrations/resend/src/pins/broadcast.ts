import * as v from 'valibot';

import * as i from '@acme/integration-framework';

import * as common from './common';

export const id = common.uuid.with({
  displayName: 'Domain ID',
  description: 'The unique identifier for the domain.',
});

export const name = i.pins.data({
  description: 'The name of the broadcast.',
  control: i.controls.text({
    placeholder: 'Monthly Newsletter',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const subject = i.pins.data({
  description: 'The subject line of the broadcast.',
  control: i.controls.text({
    placeholder: 'Welcome to our newsletter',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const content = i.pins.data({
  description: 'The HTML content of the broadcast.',
  control: i.controls.text({
    placeholder: '<h1>Hello World</h1>',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});

export const status = i.pins.data({
  description: 'The status of the broadcast.',
  control: i.controls.select({
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Sent', value: 'sent' },
      { label: 'Queued', value: 'queued' },
    ],
  }),
  schema: v.picklist(['draft', 'sent', 'queued']),
});

export const object = i.pins.data({
  description: 'A broadcast object containing all broadcast information.',
  control: false,
});

export const list = i.pins.data({
  description: 'A list of broadcasts.',
  control: false,
});
