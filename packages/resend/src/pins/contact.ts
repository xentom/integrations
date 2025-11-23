import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Contact } from 'resend'

import * as common from '@/pins/common'

export const item = i.pins.data<Contact>({
  description: 'Contact object.',
})

export const items = i.pins.data<Contact[]>({
  description: 'Array of contact objects.',
})

export const id = common.uuid.with({
  displayName: 'Contact ID',
  description: 'The unique identifier for the contact.',
  control: i.controls.select({
    async options({ state }) {
      const response = await state.resend.contacts.list()

      if (!response.data) {
        return []
      }

      return response.data.data.map((contact) => {
        return {
          value: contact.id,
          label: contact.email,
          suffix: contact.id,
        }
      })
    },
  }),
})

export const firstName = i.pins.data({
  description: 'First name of the contact.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Jane',
  }),
})

export const lastName = i.pins.data({
  description: 'Last name of the contact.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Smith',
  }),
})

export const unsubscribed = i.pins.data({
  description: 'Whether the contact is unsubscribed.',
  control: i.controls.switch(),
  schema: v.boolean(),
})
