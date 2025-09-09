import * as i from '@xentom/integration-framework';

export const actionType = i.pins.data({
  description: 'The action type of the issue',
  control: i.controls.select({
    options: [
      {
        label: 'Assigned',
        value: 'assigned',
      },
      {
        label: 'Closed',
        value: 'closed',
      },
      {
        label: 'Deleted',
        value: 'deleted',
      },
      {
        label: 'Demilestoned',
        value: 'demilestoned',
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
        label: 'Milestoned',
        value: 'milestoned',
      },
      {
        label: 'Opened',
        value: 'opened',
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
        label: 'Typed',
        value: 'typed',
      },
      {
        label: 'Unassigned',
        value: 'unassigned',
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
      {
        label: 'Untyped',
        value: 'untyped',
      },
    ],
  }),
});
