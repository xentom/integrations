import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const key = i.pins.data({
  description: 'Unique identifier for the stored value.',
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Storage key is required.'),
  ),
  control: i.controls.text({
    placeholder: 'my-key',
  }),
})

export const value = {
  input: i.pins.data({
    description: 'The value to store.',
    schema: v.string(),
    control: i.controls.text({
      placeholder: 'my-value',
      rows: 3,
    }),
  }),
  output: i.pins.data({
    description: 'The value to store.',
    schema: v.union([v.string(), v.null()]),
  }),
}
