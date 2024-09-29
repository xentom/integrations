import { IconWorldDownload } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const response = pin.custom<Response>().extend({
  icon: IconWorldDownload,
  description: 'The response from the server.',
});
