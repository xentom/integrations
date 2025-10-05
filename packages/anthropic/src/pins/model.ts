import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

export const id = i.pins.data({
  displayName: 'Model ID',
  description: 'Unique identifier for the model',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'claude-sonnet-4-5-20250929',
  }),
});
