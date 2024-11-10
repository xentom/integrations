import { IconSectionSign } from '@tabler/icons-react';
import { type TeamSpeakServerGroup } from 'ts3-nodejs-library';
import { pin } from '@xentom/integration';

export const serverGroup = pin.custom<TeamSpeakServerGroup>().extend({
  icon: IconSectionSign,
  isEditable: false,
});
