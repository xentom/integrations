import * as controls from '@/controls';
import * as schemas from '@/schemas';

import * as i from '@acme/integration-framework';

export const emailId = i.pins.data({
  description: 'The unique identifier for the email.',
  schema: schemas.uuid,
});

export const emailIdWithControl = i.pins.data({
  ...emailId,
  control: controls.uuid,
});
