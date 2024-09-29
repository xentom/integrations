import { IconCode } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Evaluation';

export const expression = createAction({
  group,
  icon: IconCode,
  description: 'Evaluate an expression',
  inputs: {
    exec: pin.exec({
      run({ next }) {
        next('exec');
      },
    }),
  },
  outputs: {
    exec: pin.exec(),
    value: pin.object({
      label: null,
      defaultValue: '{{ value }}',
      isEditable: true,
    }),
  },
  variables: {
    value: {
      type: 'pin',
    },
  },
});
