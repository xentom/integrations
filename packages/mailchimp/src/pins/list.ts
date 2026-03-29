import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type lists } from '@mailchimp/mailchimp_marketing'

export const item = i.pins.data<lists.List>({
  description: 'A Mailchimp audience (list).',
})

export const items = i.pins.data<lists.List[]>({
  description: 'A list of Mailchimp audiences.',
})

export const id = i.pins.data({
  description: 'The unique ID of a Mailchimp audience.',
  schema: v.string(),
  control: i.controls.select({
    placeholder: 'Select an audience...',
    async options({ state }) {
      const response = await state.mailchimp.lists.getAllLists({ count: 1000 })
      if (!('lists' in response)) return { items: [] }
      return {
        items: response.lists.map((list) => ({
          value: list.id,
          label: list.name,
          suffix: list.id,
        })),
      }
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the audience.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'My Newsletter',
  }),
})

export const permissionReminder = i.pins.data({
  description: 'A reminder for subscribers about why they signed up.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'You signed up on our website.',
  }),
})
