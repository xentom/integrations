import { pins } from '@acme/integration';
import * as v from 'valibot';

export const issueAction = pins.data({
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
    'all'
  ),
});
