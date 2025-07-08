import * as common from '@/pins/common';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

export interface Contact {
  created_at: string;
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  unsubscribed: boolean;
}

export const object = i.pins.data<Contact>({
  description: 'Contact object.',
});

export const objects = i.pins.data<Contact[]>({
  description: 'Array of contact objects.',
});

export const uuid = common.uuid.with({
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
