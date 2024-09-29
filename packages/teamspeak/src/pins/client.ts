import { IconUser } from '@tabler/icons-react';
import { type TeamSpeakClient } from 'ts3-nodejs-library';
import { pin } from '@xentom/integration';

export const client = pin.custom<TeamSpeakClient>().extend({
  icon: IconUser,
  isEditable: false,
});
