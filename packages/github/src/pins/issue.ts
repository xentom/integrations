import { type Issue } from '@octokit/webhooks-types';
import { IconCircleDot } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const issue = pin.custom<Issue>().extend({
  icon: IconCircleDot,
  isEditable: false,
});
