import * as v from 'valibot';

import * as i from '@acme/integration-framework';

export const issueAction = i.pins.data({
  schema: v.optional(
    v.picklist([
      'all',
      'assigned',
      'closed',
      'deleted',
      'demilestoned',
      'edited',
      'labeled',
      'locked',
      'milestoned',
      'opened',
      'pinned',
      'reopened',
      'transferred',
      'typed',
      'unassigned',
      'unlabeled',
      'unlocked',
      'unpinned',
      'untyped',
    ]),
    'all',
  ),
});
