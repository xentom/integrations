import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type GetContactResponseSuccess } from 'resend';

import * as common from '@/pins/common';

export const item = i.pins.data<GetContactResponseSuccess>({
  description: 'Contact object.',
});

export const items = i.pins.data<Omit<GetContactResponseSuccess, 'object'>[]>({
  description: 'Array of contact objects.',
});

export const id = common.uuid.with({
  displayName: 'Contact ID',
  description: 'The unique identifier for the contact.',
});

export const firstName = i.pins.data({
  description: 'First name of the contact.',
  control: i.controls.text({
    placeholder: 'Jane',
  }),
  schema: v.string(),
});

export const lastName = i.pins.data({
  description: 'Last name of the contact.',
  control: i.controls.text({
    placeholder: 'Smith',
  }),
  schema: v.string(),
});

export const unsubscribed = i.pins.data({
  description: 'Whether the contact is unsubscribed.',
  control: i.controls.switch(),
  schema: v.boolean(),
});
