import * as i from '@xentom/integration-framework';

import { type components } from '@octokit/openapi-types';

export const item = i.pins.data<components['schemas']['discussion']>({
  displayName: 'Discussion',
});

export type Action =
  | 'answered'
  | 'category_changed'
  | 'closed'
  | 'created'
  | 'deleted'
  | 'edited'
  | 'labeled'
  | 'locked'
  | 'pinned'
  | 'reopened'
  | 'transferred'
  | 'unanswered'
  | 'unlabeled'
  | 'unlocked'
  | 'unpinned';

export const action = i.pins.data<Action>({
  description: 'The action type of the discussion',
  control: i.controls.select({
    options: [
      {
        label: 'Answered',
        value: 'answered',
      },
      {
        label: 'Category Changed',
        value: 'category_changed',
      },
      {
        label: 'Closed',
        value: 'closed',
      },
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
      {
        label: 'Labeled',
        value: 'labeled',
      },
      {
        label: 'Locked',
        value: 'locked',
      },
      {
        label: 'Pinned',
        value: 'pinned',
      },
      {
        label: 'Reopened',
        value: 'reopened',
      },
      {
        label: 'Transferred',
        value: 'transferred',
      },
      {
        label: 'Unanswered',
        value: 'unanswered',
      },
      {
        label: 'Unlabeled',
        value: 'unlabeled',
      },
      {
        label: 'Unlocked',
        value: 'unlocked',
      },
      {
        label: 'Unpinned',
        value: 'unpinned',
      },
    ],
    defaultValue: 'created',
  }),
});
