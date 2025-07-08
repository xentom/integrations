import * as common from '@/pins/common';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

export const uuid = common.uuid.with({
  displayName: 'Email ID',
  description: 'The unique identifier for the email.',
});

export const address = i.pins.data({
  description: 'An email address.',
  control: i.controls.text({
    placeholder: 'john.doe@example.com',
  }),
  schema: v.pipe(v.string(), v.trim(), v.email()),
});

export const addressWithDisplayName = i.pins.data({
  description: 'An email address with a display name.',
  control: i.controls.text({
    placeholder: 'Your Name <sender@domain.com>',
  }),
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.regex(
      /^(.+?)\s*<([^<>]+@[^<>]+)>$/,
      'Must be in format "Display Name <email@domain.com>"',
    ),
  ),
});

export const addresses = i.pins.data({
  description: 'A list of email addresses.',
  control: i.controls.text({
    placeholder: 'john.doe@example.com, jane.smith@example.com',
  }),
  schema: v.pipe(
    v.string(),
    v.transform((emails) => emails.split(',')),
    v.pipe(v.array(v.pipe(v.string(), v.trim(), v.email())), v.maxLength(50)),
  ),
});

export const subject = i.pins.data({
  description: 'Email subject line.',
  control: i.controls.text({
    placeholder: 'Subject of the email',
  }),
  schema: v.string(),
});

export const body = i.pins.data({
  description: 'Email body content. This is a simple text message.',
  control: i.controls.text({
    placeholder: 'Write your email as plain text here',
    rows: 5,
  }),
  schema: v.string(),
});
