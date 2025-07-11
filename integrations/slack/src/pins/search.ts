import {
  type SearchAllResponse,
  type SearchFilesResponse,
  type SearchMessagesResponse,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Search query
export const query = i.pins.data({
  description: 'Search query string.',
  control: i.controls.text({
    placeholder: 'from:john hello world',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Sort order
export const sort = i.pins.data({
  description: 'Sort results by timestamp or score.',
  control: i.controls.select({
    options: [
      { label: 'Score', value: 'score' },
      { label: 'Timestamp', value: 'timestamp' },
    ],
  }),
  optional: true,
  schema: v.optional(v.picklist(['score', 'timestamp'])),
});

// Sort direction
export const sortDir = i.pins.data({
  description: 'Sort direction.',
  control: i.controls.select({
    options: [
      { label: 'Descending', value: 'desc' },
      { label: 'Ascending', value: 'asc' },
    ],
  }),
  optional: true,
  schema: v.optional(v.picklist(['asc', 'desc'])),
});

// Highlight search terms
export const highlight = i.pins.data({
  description: 'Highlight search terms in results.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Search responses
export const messagesSearchResponse = i.pins.data<SearchMessagesResponse>({
  description: 'Response from searching messages.',
});

export const filesSearchResponse = i.pins.data<SearchFilesResponse>({
  description: 'Response from searching files.',
});

export const allSearchResponse = i.pins.data<SearchAllResponse>({
  description: 'Response from searching all content.',
});
