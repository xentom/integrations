import {
  IconAbc,
  IconBraces,
  IconBrackets,
  IconNumber123,
  IconToggleLeft,
} from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Data Types';

export const string = createAction({
  group,
  icon: IconAbc,
  description: 'A string value.',
  outputs: {
    value: pin.string({
      label: null,
      defaultValue: '',
    }),
  },
});

export const number = createAction({
  group,
  icon: IconNumber123,
  description: 'A number value.',
  outputs: {
    value: pin.number({
      label: null,
      defaultValue: 0,
    }),
  },
});

export const boolean = createAction({
  group,
  icon: IconToggleLeft,
  description: 'A boolean value.',
  outputs: {
    value: pin.boolean({
      label: null,
      defaultValue: true,
    }),
  },
});

export const array = createAction({
  group,
  icon: IconBrackets,
  description: 'An array value.',
  outputs: {
    value: pin.array({
      label: null,
      defaultValue: [],
      isEditable: true,
    }),
  },
});

export const object = createAction({
  group,
  icon: IconBraces,
  description: 'An object value.',
  outputs: {
    value: pin.object({
      label: null,
      defaultValue: {},
      isEditable: true,
    }),
  },
});
