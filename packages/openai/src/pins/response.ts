import { type Response } from 'openai/resources/responses/responses';
import * as z from 'zod';

import * as i from '@acme/integration';

export const responseId = i.pins.data({
  displayName: 'Response ID',
  description: 'The unique identifier of the response.',
  schema: z.string(),
  control: i.controls.text({
    placeholder: 'resp_...',
  }),
});

export const response = i.pins.data<Response>({
  description: 'A response object representing a response from OpenAI.',
});
