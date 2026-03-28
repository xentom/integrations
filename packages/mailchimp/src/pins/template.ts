import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type MailchimpTemplate } from '@/utils/client'

export const item = i.pins.data<MailchimpTemplate>({
  description: 'A Mailchimp email template.',
})

export const items = i.pins.data<MailchimpTemplate[]>({
  description: 'A list of Mailchimp email templates.',
})

export const id = i.pins.data({
  description: 'The unique numeric ID of a Mailchimp template.',
  schema: v.pipe(v.string(), v.transform(Number)),
  control: i.controls.select({
    placeholder: 'Select a template...',
    async options({ state }) {
      const response = await state.mailchimp.templates.list({ count: 1000 })
      return {
        items: (response.templates ?? []).map((template) => ({
          value: String(template.id),
          label: template.name,
          suffix: String(template.id),
        })),
      }
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the template.',
  schema: v.string(),
  control: i.controls.text({ placeholder: 'Monthly Newsletter Template' }),
})

export const htmlContent = i.pins.data({
  description: 'The HTML content of the template.',
  schema: v.string(),
  control: i.controls.text({ language: i.TextControlLanguage.Html, rows: 10 }),
})
