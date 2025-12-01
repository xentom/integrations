import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Segment } from 'resend'

import * as common from '@/pins/common'
import { getPagination } from '@/utils/pagination'

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
    async options({ state, pagination }) {
      const response = await state.resend.segments.list({
        ...getPagination(pagination),
      })

      if (!response.data) {
        return { items: [] }
      }

      return {
        hasMore: response.data.has_more,
        items: response.data.data.map((segment) => ({
          value: segment.id,
          label: segment.name,
          suffix: segment.id,
        })),
      }
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
