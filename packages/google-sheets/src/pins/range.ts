import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

export const a1Notation = i.pins.data({
  displayName: 'Range (A1 Notation)',
  description: 'A range in A1 notation, e.g., Sheet1!A1:C10',
  control: i.controls.text({
    placeholder: 'Sheet1!A1:C10',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
});
