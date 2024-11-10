import * as pins from '@/pins';
import { IconSectionSign } from '@tabler/icons-react';
import { createAction } from '@xentom/integration';

const group = 'Channels/Groups';

export const getChannelGroups = createAction({
  group,
  icon: IconSectionSign,
  description: 'Returns a list of all channel groups.',
  outputs: {
    groups: pins.channelGroup.extend({
      description: 'Returns a list of all channel groups.',
    }),
  },
  async run({ outputs, state }) {
    outputs.groups = await state.ts.channelGroupList();
  },
});
