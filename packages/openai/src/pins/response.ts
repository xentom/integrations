import * as i from '@xentom/integration-framework';
import * as z from 'zod';

import { type Response } from 'openai/resources/responses/responses';

export const item = i.pins.data<Response>({
  description: 'A response object representing a response from OpenAI.',
});

export const id = i.pins.data({
  displayName: 'Response ID',
  description: 'The unique identifier of the response.',
  schema: z.string(),
  control: i.controls.text({
    placeholder: 'resp_...',
  }),
});
