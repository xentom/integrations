import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { TeamSpeakClient } from 'ts3-nodejs-library';
import { type ClientEntry } from 'ts3-nodejs-library/lib/types/ResponseTypes';

export const item = {
  input: i.pins.data({
    schema({ state }) {
      return v.pipe(
        v.custom<ClientEntry>((value) => {
          return !!value && typeof value === 'object' && 'cid' in value;
        }),
        v.transform((data) => new TeamSpeakClient(state.teamspeak, data)),
      );
    },
  }),
  output: i.pins.data({
    schema: v.pipe(
      v.custom<TeamSpeakClient>((value) => {
        return value instanceof TeamSpeakClient;
      }),
      v.transform((value) => {
        return value.toJSON() as ClientEntry;
      }),
    ),
  }),
};

export const items = {
  output: i.pins.data({
    schema: v.pipe(
      v.array(
        v.custom<TeamSpeakClient>((value) => {
          return value instanceof TeamSpeakClient;
        }),
      ),
      v.transform((clients) => {
        return clients.map((client) => client.toJSON() as ClientEntry);
      }),
    ),
  }),
};
