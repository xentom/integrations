import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

export const matrix = i.pins.data({
  displayName: 'Values',
  description: '2D array of values (rows x columns).',
  control: i.controls.expression({
    defaultValue: [['']],
  }),
  schema: v.array(v.array(v.unknown())),
});
