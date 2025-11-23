import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Broadcast } from 'resend'

import * as common from './common'

export const item = i.pins.data<Broadcast>({
  description: 'A broadcast object containing all broadcast information.',
  control: false,
})

export const items = i.pins.data<Broadcast[]>({
  description: 'A list of broadcasts.',
  control: false,
})

export const id = common.uuid.with({
  displayName: 'Domain ID',
  description: 'The unique identifier for the domain.',
  control: i.controls.select({
    async options({ state }) {
      const response = await state.resend.broadcasts.list()
      if (!response.data) {
        return []
      }

      return response.data.data.map((broadcast) => {
        return {
          value: broadcast.id,
          label: broadcast.name,
          suffix: broadcast.id,
        }
      })
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the broadcast.',
  control: i.controls.text({
    placeholder: 'Monthly Newsletter',
  }),
  schema: v.pipe(v.string(), v.minLength(1)),
})

export const subject = i.pins.data({
  description: 'The subject line of the broadcast.',
  schema: v.pipe(v.string(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'Welcome to our newsletter',
  }),
})

export const content = i.pins.data({
  description: 'The HTML content of the broadcast.',
  schema: v.pipe(v.string(), v.minLength(1)),
  control: i.controls.text({
    placeholder: '<h1>Hello World</h1>',
  }),
})

export const status = i.pins.data({
  description: 'The status of the broadcast.',
  schema: v.picklist(['draft', 'sent', 'queued']),
  control: i.controls.select({
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Sent', value: 'sent' },
      { label: 'Queued', value: 'queued' },
    ],
  }),
})
