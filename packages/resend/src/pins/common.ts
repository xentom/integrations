import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

export const uuid = i.pins.data({
  description: 'A unique identifier.',
  schema: v.pipe(v.string(), v.uuid()),
  control: i.controls.text({
    placeholder: '00000000-0000-...',
  }),
});
