import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type MailchimpSegment } from '@/utils/client'

export const item = i.pins.data<MailchimpSegment>({
  description: 'A Mailchimp audience segment.',
})

export const items = i.pins.data<MailchimpSegment[]>({
  description: 'A list of Mailchimp audience segments.',
})

export const id = i.pins.data({
  description: 'The unique numeric ID of a Mailchimp segment.',
  schema: v.pipe(v.string(), v.transform(Number)),
  control: i.controls.text({ placeholder: '123456' }),
})

export const name = i.pins.data({
  description: 'The name of the segment.',
  schema: v.string(),
  control: i.controls.text({ placeholder: 'Active subscribers' }),
})
