import { type Commit } from '@octokit/webhooks-types';
import { IconGitCommit } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const commit = pin.custom<Commit>().extend({
  icon: IconGitCommit,
  isEditable: false,
});
