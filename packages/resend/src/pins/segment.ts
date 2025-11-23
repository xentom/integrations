import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Segment } from 'resend'

import * as common from '@/pins/common'

export const item = i.pins.data<Segment>({
  description: 'A segment containing contacts.',
  control: false,
})

export const items = i.pins.data<Segment[]>({
  description: 'A list of segments.',
  control: false,
})

export const id = common.uuid.with({
  displayName: 'Segment ID',
  description: 'The unique identifier for the segment.',
  control: i.controls.select({
    async options({ state }) {
      const response = await state.resend.segments.list()
      if (!response.data) {
        return []
      }

      return response.data.data.map((segment) => {
        return {
          value: segment.id,
          label: segment.name,
          suffix: segment.id,
        }
      })
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the segment.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'My Segment',
  }),
})

export const createdAt = i.pins.data({
  description: 'The date and time when the segment was created.',
  control: false,
  schema: v.pipe(v.string(), v.isoDateTime()),
})
