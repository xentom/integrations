import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type components } from '@octokit/openapi-types';

export const item = i.pins.data<components['schemas']['full-repository']>({
  displayName: 'Repository',
});

export type Action =
  | 'archived'
  | 'deleted'
  | 'edited'
  | 'privatized'
  | 'publicized'
  | 'renamed'
  | 'transferred'
  | 'unarchived';

export const action = i.pins.data<Action>({
  description: 'The action type of the repository',
  control: i.controls.select({
    options: [
      {
        label: 'Archived',
        value: 'archived',
      },
      {
        label: 'Deleted',
        value: 'deleted',
      },
      {
        label: 'Edited',
        value: 'edited',
      },
      {
        label: 'Privatized',
        value: 'privatized',
      },
      {
        label: 'Publicized',
        value: 'publicized',
      },
      {
        label: 'Renamed',
        value: 'renamed',
      },
      {
        label: 'Transferred',
        value: 'transferred',
      },
      {
        label: 'Unarchived',
        value: 'unarchived',
      },
    ],
    defaultValue: 'edited',
  }),
});

export const name = i.pins.data({
  description: 'The full name of the repository (e.g., octocat/Hello-World)',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    async options(opts) {
      const repositories =
        await opts.state.octokit.rest.repos.listForAuthenticatedUser();

      return repositories.data.map((repo) => ({
        value: repo.full_name,
      }));
    },
  }),
});
