import { IconSectionSign, IconVolume } from '@tabler/icons-react';
import {
  type TeamSpeakChannel,
  type TeamSpeakChannelGroup,
} from 'ts3-nodejs-library';
import { pin } from '@xentom/integration';

export const channel = pin.custom<TeamSpeakChannel>().extend({
  icon: IconVolume,
  isEditable: false,
});

export const channelGroup = pin.custom<TeamSpeakChannelGroup>().extend({
  icon: IconSectionSign,
  isEditable: false,
});
