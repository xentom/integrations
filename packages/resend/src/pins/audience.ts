import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Audience } from 'resend'

import * as common from '@/pins/common'

export const item = i.pins.data<Audience>({
  description: 'A audience object containing all audience information.',
  control: false,
})

export const items = i.pins.data<Audience[]>({
  description: 'A list of audiences.',
  control: false,
})

export const id = common.uuid.with({
  displayName: 'Audience ID',
  description: 'The unique identifier for the audience.',
  control: i.controls.select({
    async options({ state }) {
      const response = await state.resend.audiences.list()
      if (!response.data) {
        return []
      }

      return response.data.data.map((audience) => {
        return {
          value: audience.id,
          label: audience.name,
          suffix: audience.id,
        }
      })
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the audience.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'My Audience',
  }),
})

export const createdAt = i.pins.data({
  description: 'The date and time when the audience was created.',
  control: false,
  schema: v.pipe(v.string(), v.isoDateTime()),
})
