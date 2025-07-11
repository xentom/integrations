import {
  type RemindersAddResponse,
  type RemindersListResponse,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Reminder text content
export const text = i.pins.data({
  description: 'The content of the reminder.',
  control: i.controls.text({
    placeholder: 'Take a break',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Reminder time (timestamp or natural language)
export const time = i.pins.data({
  description:
    'When the reminder should be sent (Unix timestamp or "in 30 minutes").',
  control: i.controls.text({
    placeholder: 'in 30 minutes',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Reminder ID
export const reminderId = i.pins.data({
  description: 'Slack reminder ID.',
  control: i.controls.text({
    placeholder: 'Rm1234567890',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Reminder response
export const reminderResponse = i.pins.data<RemindersAddResponse>({
  description: 'Response from reminder operations.',
});

// Reminders list response
export const remindersListResponse = i.pins.data<RemindersListResponse>({
  description: 'Response containing list of reminders.',
});
