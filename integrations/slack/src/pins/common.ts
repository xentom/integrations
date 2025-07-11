import { type WebAPICallResult } from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Timestamp pin for Slack message timestamps
export const timestamp = i.pins.data({
  description: 'A Slack timestamp string (e.g., 1234567890.123456).',
  control: i.controls.text({
    placeholder: '1234567890.123456',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Generic text pin
export const text = i.pins.data({
  description: 'Text content.',
  control: i.controls.text({
    placeholder: 'Enter text...',
  }),
  schema: v.pipe(v.string(), v.trim()),
});

// Optional text pin
export const optionalText = i.pins.data({
  description: 'Optional text content.',
  control: i.controls.text({
    placeholder: 'Enter text...',
  }),
  optional: true,
  schema: v.pipe(v.string(), v.trim()),
});

// Boolean flag pin
export const flag = i.pins.data({
  description: 'A boolean flag.',
  control: i.controls.switch(),
  schema: v.boolean(),
});

// Optional boolean flag
export const optionalFlag = i.pins.data({
  description: 'An optional boolean flag.',
  control: i.controls.switch(),
  optional: true,
  schema: v.boolean(),
});

// Limit/count pin for pagination
export const limit = i.pins.data({
  description: 'The maximum number of items to return.',
  control: i.controls.expression({
    placeholder: '100',
  }),
  optional: true,
  schema: v.optional(
    v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(1000)),
  ),
});

// Cursor for pagination
export const cursor = i.pins.data({
  description: 'Pagination cursor for retrieving next page of results.',
  control: i.controls.text({
    placeholder: 'dXNlcjpVMDY...',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Generic Slack API response
export const slackResponse = i.pins.data<WebAPICallResult>({
  description: 'Generic response from Slack API.',
});
