import { type ChannelEntry } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import * as v from 'valibot';

import * as i from '@acme/integration';

type test = ChannelEntry;

export const channel = i.pins.data({
  displayName: 'Channel',
  description: 'The details of a TeamSpeak channel',
  schema: v.custom<test>(() => true),

  // // Runs before the run function
  // deserialize(channel: AcmeChannel) {
  //   new TeamSpeakChannel(null, {});

  //   // pin.schema => orginal
  //   return channel;
  // },

  // // Runs after the run function
  // serialize(channel: TeamSpeakChannel) {
  //   // orginal => pin.schema
  //   return channel.toJSON();
  // },
});

export const channelId = i.pins.data({
  displayName: 'Channel ID',
  description: 'The ID of a TeamSpeak channel',
  schema: v.string(),
  control: i.controls.select({
    async options(opts) {
      const channels = await opts.state.teamspeak.channelList();
      return channels.map((channel) => {
        return {
          value: channel.cid,
          label: `${channel.cid} (${channel.name})`,
        };
      });
    },
  }),
});

export const channelName = i.pins.data({
  description: 'The name of a TeamSpeak channel',
  schema: v.string(),
  control: i.controls.select({
    async options(opts) {
      const channels = await opts.state.teamspeak.channelList();
      return channels.map((channel) => {
        return {
          value: channel.name,
          label: channel.name,
        };
      });
    },
  }),
});
