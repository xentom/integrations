import { TeamSpeakChannel } from 'ts3-nodejs-library';
import { type ChannelEntry } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

export const object = {
  input: i.pins.data({
    displayName: 'Channel',
    description: 'The details of a TeamSpeak channel',
    schema: ({ state }) =>
      v.pipe(
        v.custom<ChannelEntry>((value) => {
          return !!value && typeof value === 'object' && 'cid' in value;
        }),
        v.transform((value) => new TeamSpeakChannel(state.teamspeak, value)),
      ),
  }),

  output: i.pins.data({
    displayName: 'Channel',
    description: 'The details of a TeamSpeak channel',
    schema: v.pipe(
      v.custom<TeamSpeakChannel>((value) => value instanceof TeamSpeakChannel),
      v.transform((value) => value.toJSON() as ChannelEntry),
    ),
  }),
};

export const id = i.pins.data({
  displayName: 'ID',
  description: 'The ID of a TeamSpeak channel',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '1',
  }),
});

export const idSelection = id.with({
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

export const parentId = i.pins.data({
  displayName: 'Parent Channel ID',
  description: 'The ID of the parent channel (0 for root level)',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '0',
  }),
});

export const parentIdSelection = parentId.with({
  control: i.controls.select({
    async options(opts) {
      const channels = await opts.state.teamspeak.channelList();
      return [
        { value: '0', label: 'Root Level' },
        ...channels.map((channel) => {
          return {
            value: channel.cid,
            label: `${channel.cid} (${channel.name})`,
          };
        }),
      ];
    },
  }),
});

export const name = i.pins.data({
  displayName: 'Name',
  description: 'The name of a TeamSpeak channel',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Default Channel',
  }),
});

export const nameSelection = name.with({
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

export const topic = i.pins.data({
  displayName: 'Topic',
  description: 'The topic of the channel',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Channel topic...',
  }),
});

export const password = i.pins.data({
  displayName: 'Password',
  description: 'Password required to join the channel',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Enter password...',
  }),
});

export const description = i.pins.data({
  displayName: 'Description',
  description: 'The description of the channel',
  control: i.controls.text({
    placeholder: 'Channel description...',
  }),
  schema: v.string(),
});

export enum ChannelType {
  TEMPORARY = 0,
  SEMI_PERMANENT = 1,
  PERMANENT = 2,
}

export const type = i.pins.data<ChannelType>({
  displayName: 'Type',
  description: 'The type of the channel',
  schema: v.number(),
  control: i.controls.select({
    options: [
      { value: ChannelType.TEMPORARY, label: 'Temporary' },
      { value: ChannelType.SEMI_PERMANENT, label: 'Semi-Permanent' },
      { value: ChannelType.PERMANENT, label: 'Permanent' },
    ],
    defaultValue: ChannelType.TEMPORARY,
  }),
});

export const codec = i.pins.data({
  displayName: 'Codec',
  description: 'Audio codec used for the channel',
  schema: v.number(),
  control: i.controls.select({
    options: [
      { value: 0, label: 'Speex Narrowband' },
      { value: 1, label: 'Speex Wideband' },
      { value: 2, label: 'Speex Ultra-Wideband' },
      { value: 3, label: 'CELT Mono' },
      { value: 4, label: 'Opus Voice' },
      { value: 5, label: 'Opus Music' },
    ],
    defaultValue: 4,
  }),
});

export const codecQuality = i.pins.data({
  displayName: 'Codec Quality',
  description: 'Audio quality setting for the codec (0-10)',
  schema: v.pipe(v.number(), v.minValue(0), v.maxValue(10)),
  control: i.controls.expression({
    placeholder: '6',
    defaultValue: 6,
  }),
});

export const maxClients = i.pins.data({
  displayName: 'Max Clients',
  description: 'Maximum number of clients allowed in the channel',
  schema: v.pipe(v.number(), v.minValue(-1)),
  control: i.controls.expression({
    defaultValue: -1,
  }),
});

export const maxFamilyClients = i.pins.data({
  displayName: 'Max Family Clients',
  description: 'Maximum number of clients in the channel family',
  schema: v.pipe(v.number(), v.minValue(-1)),
  control: i.controls.expression(),
});

export const order = i.pins.data({
  displayName: 'Order',
  description: 'Sort order of the channel',
  schema: v.number(),
  control: i.controls.expression({
    placeholder: '0',
    defaultValue: 0,
  }),
});

export const neededTalkPower = i.pins.data({
  displayName: 'Needed Talk Power',
  description: 'Required talk power to speak in the channel',
  schema: v.pipe(v.number(), v.minValue(0)),
  control: i.controls.expression({
    placeholder: '0',
    defaultValue: 0,
  }),
});

export const namePhonetic = i.pins.data({
  displayName: 'Phonetic Name',
  description: 'Phonetic name for text-to-speech',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Phonetic pronunciation...',
  }),
});

// Channel flags
export const flagDefault = i.pins.data({
  displayName: 'Default Channel',
  description: 'Whether this is the default channel',
  schema: v.boolean(),
  control: i.controls.switch({
    defaultValue: false,
  }),
});

export const flagMaxClientsUnlimited = i.pins.data({
  displayName: 'Unlimited Max Clients',
  description: 'Whether max clients is unlimited',
  schema: v.boolean(),
  control: i.controls.switch(),
});

export const flagMaxFamilyClientsInherited = i.pins.data({
  displayName: 'Inherit Max Family Clients',
  description: 'Whether max family clients is inherited',
  schema: v.boolean(),
  control: i.controls.switch(),
});

export const codecIsUnencrypted = i.pins.data({
  displayName: 'Unencrypted Codec',
  description: 'Whether the codec is unencrypted',
  schema: v.boolean(),
  control: i.controls.switch(),
});
