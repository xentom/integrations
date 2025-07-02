import * as v from 'valibot';

import * as i from '@acme/integration';

export const emailId = i.pins.data({
  description: 'The unique identifier for the email.',
  schema: v.pipe(v.string(), v.uuid()),
});

export const emailIdWithControl = i.pins.data({
  ...emailId,
  control: i.controls.text({
    placeholder: '00000000-0000-...',
  }),
});
