import * as common from '@/pins/common';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

export const id = common.uuid.with({
  displayName: 'Audience ID',
  description: 'The unique identifier for the audience.',
});

export const name = i.pins.data({
  description: 'The name of the audience.',
  control: i.controls.text({
    placeholder: 'My Audience',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

export const createdAt = i.pins.data({
  description: 'The date and time when the audience was created.',
  control: false,
  schema: v.pipe(v.string(), v.isoDateTime()),
});
