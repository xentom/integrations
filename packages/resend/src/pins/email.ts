import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from '@/pins/common'

const EmailSchmea = v.pipe(v.string(), v.trim(), v.email())

export const id = common.uuid.with({
  displayName: 'Email ID',
  description: 'The unique identifier for the email.',
  control: i.controls.select({
    async options({ state }) {
      const response = await state.resend.emails.list()
      if (!response.data) {
        return []
      }

      return response.data.data.map((email) => {
        return {
          value: email.id,
          label: email.subject,
          suffix: email.id,
        }
      })
    },
  }),
})

export const address = i.pins.data({
  description: 'An email address.',
  schema: EmailSchmea,
  control: i.controls.text({
    placeholder: 'john.doe@example.com',
  }),
})

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
})

export const addresses = i.pins.data({
  description: 'A list of email addresses.',
  control: i.controls.text({
    placeholder: 'john.doe@example.com, jane.smith@example.com',
  }),
  schema: v.pipe(
    v.string(),
    v.transform((emails) => emails.replace('\n', '').split(',')),
    v.pipe(v.array(EmailSchmea), v.maxLength(50)),
  ),
})

export const subject = i.pins.data({
  description: 'Email subject line.',
  control: i.controls.text({
    placeholder: 'Subject of the email',
  }),
  schema: v.string(),
})

export const body = i.pins.data({
  description: 'Email body content. This is a simple text message.',
  control: i.controls.text({
    placeholder: 'Write your email as plain text here',
    rows: 5,
  }),
  schema: v.string(),
})

export const html = i.pins.data({
  displayName: 'HTML',
  description: 'The HTML content of the email.',
  control: i.controls.text({
    language: i.TextControlLanguage.Html,
    placeholder: '<h1>Hello World</h1>',
    rows: 3,
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
})

export const text = i.pins.data({
  description: 'The plain text content of the email.',
  control: i.controls.text({
    language: i.TextControlLanguage.Plain,
    placeholder: 'Plain text content',
    rows: 3,
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
})

export const previewText = i.pins.data({
  description: 'A short snippet shown in email previews.',
  control: i.controls.text({
    placeholder: 'Preview text',
  }),
  schema: v.string(),
})

export const scheduledAt = i.pins.data({
  description:
    'Schedule email for future sending (ISO 8601 format or natural language like "in 1 min").',
  control: i.controls.text({
    placeholder: '2024-08-05T11:52:01.858Z',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
})

export const headers = i.pins.data({
  description: 'Custom email headers as key-value pairs.',
  control: i.controls.expression({
    defaultValue: {
      'X-Custom-Header': 'value',
    },
  }),
  schema: v.record(v.string(), v.string()),
})

export const attachments = i.pins.data({
  description: 'File attachments',
  control: i.controls.expression({
    defaultValue: [
      {
        filename: 'file.pdf',
        content: 'base64content',
        contentType: 'application/pdf',
      },
    ],
  }),
  schema: v.array(
    v.object({
      content: v.optional(v.string()),
      filename: v.optional(v.string()),
      path: v.optional(v.string()),
      contentType: v.optional(v.string()),
    }),
  ),
})

export const tags = i.pins.data({
  description: 'Custom key/value metadata for email tracking.',
  control: i.controls.expression({
    defaultValue: [{ name: 'category', value: 'newsletter' }],
  }),
  schema: v.array(
    v.object({
      name: v.pipe(
        v.string(),
        v.regex(
          /^[a-zA-Z0-9_-]+$/,
          'Name must contain only letters, numbers, underscores, or dashes',
        ),
        v.maxLength(256),
      ),
      value: v.pipe(
        v.string(),
        v.regex(
          /^[a-zA-Z0-9_-]+$/,
          'Value must contain only letters, numbers, underscores, or dashes',
        ),
        v.maxLength(256),
      ),
    }),
  ),
})

export const idempotencyKey = i.pins.data({
  description: 'Unique key for safe retries without duplicating operations.',
  control: i.controls.text({
    placeholder: 'unique-key-123',
  }),
  schema: v.pipe(v.string(), v.minLength(1), v.maxLength(256)),
})
