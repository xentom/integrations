import {
  type ReactionsGetResponse,
  type ReactionsListResponse,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Emoji name (without colons)
export const name = i.pins.data({
  description: 'Emoji name (without colons, e.g., "thumbsup").',
  control: i.controls.text({
    placeholder: 'thumbsup',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Full user info flag
export const full = i.pins.data({
  description: 'Include full user information in reaction details.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Page number for pagination
export const page = i.pins.data({
  description: 'Page number for paginated results.',
  control: i.controls.text({
    placeholder: '1',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Reactions get response
export const reactionsGetResponse = i.pins.data<ReactionsGetResponse>({
  description: 'Response containing reaction information for a message.',
});

// Reactions list response
export const reactionsListResponse = i.pins.data<ReactionsListResponse>({
  description: 'Response containing list of reactions by a user.',
});
