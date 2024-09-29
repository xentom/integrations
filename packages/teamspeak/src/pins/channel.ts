import { IconVolume } from '@tabler/icons-react';
import { type TeamSpeakChannel } from 'ts3-nodejs-library';
import { pin } from '@xentom/integration';

export const channel = pin.custom<TeamSpeakChannel>().extend({
  icon: IconVolume,
  isEditable: false,
});
