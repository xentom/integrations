import * as i from '@xentom/integration-framework';

export const eventType = i.pins.data({
  description: 'The type of discount event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Updated', value: 'updated' },
      { label: 'Deleted', value: 'deleted' },
    ],
    defaultValue: 'created',
  } as const),
});
