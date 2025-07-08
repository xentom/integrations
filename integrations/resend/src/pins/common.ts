import * as v from 'valibot';

import * as i from '@acme/integration-framework';

export const uuid = i.pins.data({
  description: 'A unique identifier.',
  control: i.controls.text({
    placeholder: '00000000-0000-...',
  }),
  schema: v.pipe(v.string(), v.uuid()),
});
