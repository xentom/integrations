import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type lists } from '@mailchimp/mailchimp_marketing'

export const item = i.pins.data<lists.MembersSuccessResponse>({
  description: 'A Mailchimp list member.',
})

export const items = i.pins.data<lists.MembersSuccessResponse[]>({
  description: 'A list of Mailchimp list members.',
})

export const email = i.pins.data({
  description: 'The email address of the member.',
  schema: v.pipe(v.string(), v.email()),
  control: i.controls.text({ placeholder: 'user@example.com' }),
})

export const status = i.pins.data({
  description: 'The subscription status of the member.',
  schema: v.picklist(['subscribed', 'unsubscribed', 'pending', 'cleaned']),
  control: i.controls.select({
    options: [
      { value: 'subscribed', label: 'Subscribed' },
      { value: 'unsubscribed', label: 'Unsubscribed' },
      { value: 'pending', label: 'Pending' },
      { value: 'cleaned', label: 'Cleaned' },
    ],
  }),
})

export const firstName = i.pins.data({
  description: "The member's first name.",
  schema: v.string(),
  control: i.controls.text({ placeholder: 'Jane' }),
})

export const lastName = i.pins.data({
  description: "The member's last name.",
  schema: v.string(),
  control: i.controls.text({ placeholder: 'Doe' }),
})

export const tags = i.pins.data<string[]>({
  description: 'A list of tag names to apply to the member.',
})
