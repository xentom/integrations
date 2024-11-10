import * as pins from '@/pins';
import { IconSectionSign } from '@tabler/icons-react';
import { createAction } from '@xentom/integration';

const group = 'Server/Groups';

export const getServerGroups = createAction({
  group,
  icon: IconSectionSign,
  description: 'Returns a list of server groups.',
  outputs: {
    groups: pins.serverGroup.extend({
      description: 'Returns a list of server groups.',
    }),
  },
  async run({ outputs, state }) {
    outputs.groups = await state.ts.serverGroupList();
  },
});
