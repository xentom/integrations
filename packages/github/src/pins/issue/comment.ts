import * as i from '@xentom/integration-framework';

import { type components } from '@octokit/openapi-types';

import * as general from '@/pins/general';

export type Action = 'created' | 'deleted' | 'edited';

export const action = i.pins.data<Action>({
  description: 'The action type of the issue comment',
  control: i.controls.select({
    options: [
      {
        label: 'Created',
        value: 'created',
      },
      {
        label: 'Deleted',
        value: 'deleted',
      },
      {
        label: 'Edited',
        value: 'edited',
      },
    ],
    defaultValue: 'created',
  }),
});

export const item = i.pins.data<components['schemas']['issue-comment']>({
  displayName: 'Comment',
});

export const items = i.pins.data<components['schemas']['issue-comment'][]>({
  displayName: 'Comments',
});

export const body = general.markdown.with({
  description: 'The body content of the issue comment',
});
