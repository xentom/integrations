import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const name = i.pins.data({
  description: 'The name of the tag.',
  schema: v.string(),
  control: i.controls.text({ placeholder: 'VIP' }),
})

export const status = i.pins.data({
  description: "The tag status: 'active' to add, 'inactive' to remove.",
  schema: v.picklist(['active', 'inactive']),
  control: i.controls.select({
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  }),
})
