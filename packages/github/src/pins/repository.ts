import { type Repository } from '@octokit/webhooks-types';
import { IconBook2 } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const repository = pin.custom<Repository>().extend({
  icon: IconBook2,
  isEditable: false,
});
