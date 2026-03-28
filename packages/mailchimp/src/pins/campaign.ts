import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type campaigns } from '@mailchimp/mailchimp_marketing'

export const item = i.pins.data<campaigns.Campaigns>({
  description: 'A Mailchimp campaign.',
})

export const items = i.pins.data<campaigns.Campaigns[]>({
  description: 'A list of Mailchimp campaigns.',
})

export const id = i.pins.data({
  description: 'The unique ID of a Mailchimp campaign.',
  schema: v.string(),
  control: i.controls.select({
    placeholder: 'Select a campaign...',
    async options({ state }) {
      const response = await state.mailchimp.campaigns.list({ count: 1000 })
      if (!('campaigns' in response)) return { items: [] }
      return {
        items: response.campaigns.map((campaign) => ({
          value: campaign.id,
          label: campaign.settings?.title ?? campaign.id,
          suffix: campaign.id,
        })),
      }
    },
  }),
})

export const type = i.pins.data({
  description: 'The type of campaign.',
  schema: v.picklist(['regular', 'plaintext', 'rss', 'variate']),
  control: i.controls.select({
    options: [
      { value: 'regular', label: 'Regular' },
      { value: 'plaintext', label: 'Plain Text' },
      { value: 'rss', label: 'RSS' },
      { value: 'variate', label: 'Variate' },
    ],
  }),
})

export const subject = i.pins.data({
  description: 'The subject line for the campaign.',
  schema: v.string(),
  control: i.controls.text({ placeholder: 'Your monthly newsletter' }),
})

export const title = i.pins.data({
  description: 'The internal title of the campaign.',
  schema: v.string(),
  control: i.controls.text({ placeholder: 'October Newsletter' }),
})

export const fromName = i.pins.data({
  description: "The 'From' name for the campaign.",
  schema: v.string(),
  control: i.controls.text({ placeholder: 'Acme Corp' }),
})

export const replyTo = i.pins.data({
  description: 'The reply-to email address for the campaign.',
  schema: v.pipe(v.string(), v.email()),
  control: i.controls.text({ placeholder: 'hello@acme.com' }),
})

export const htmlContent = i.pins.data({
  description: 'The HTML content of the campaign.',
  schema: v.string(),
  control: i.controls.text({ language: i.TextControlLanguage.Html, rows: 10 }),
})

export const plainText = i.pins.data({
  description: 'The plain-text content of the campaign.',
  schema: v.string(),
  control: i.controls.text({ language: i.TextControlLanguage.Plain, rows: 10 }),
})

export const scheduleTime = i.pins.data({
  description:
    'The UTC date and time to schedule the campaign (ISO 8601 format).',
  schema: v.string(),
  control: i.controls.text({ placeholder: '2025-01-01T12:00:00Z' }),
})
