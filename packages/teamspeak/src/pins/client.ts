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
        v.transform((value) => new TeamSpeakClient(state.teamspeak, value)),
      );
    },
  }),
  output: i.pins.data({
    schema: v.pipe(
      v.custom<TeamSpeakClient>((value) => value instanceof TeamSpeakClient),
      v.transform((value) => value.toJSON() as ClientEntry),
    ),
  }),
};
