import { controls, pins } from '@acme/integration';
import * as v from 'valibot';

export const channel = pins.data({
  displayName: 'Channel',
  description: 'The details of a TeamSpeak channel',
  schema: v.custom<any>(() => true),

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

export const channelId = pins.data({
  displayName: 'Channel ID',
  description: 'The ID of a TeamSpeak channel',
  schema: v.string(),
  control: controls.select({
    async options({ state }) {
      const channels = await state.teamspeak.channelList();
      return channels.map((channel) => {
        return {
          value: channel.cid,
          label: `${channel.cid} (${channel.name})`,
        };
      });
    },
  }),
});

export const channelName = pins.data({
  description: 'The name of a TeamSpeak channel',
  schema: v.string(),
  control: controls.select({
    async options({ state }) {
      const channels = await state.teamspeak.channelList();
      return channels.map((channel) => {
        return {
          value: channel.name,
          label: channel.name,
        };
      });
    },
  }),
});
