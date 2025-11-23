import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

const nodes = i.nodes.group('Data types/Primitives')

export const number = nodes.pure({
  outputs: {
    number: i.pins.data({
      displayName: false,
      control: i.controls.expression({
        placeholder: 'Enter a number',
        defaultValue: 0,
      }),
      schema: v.number(),
    }),
  },
})

export const string = nodes.pure({
  outputs: {
    string: i.pins.data({
      displayName: false,
      control: i.controls.text({
        placeholder: 'Enter a string',
        defaultValue: '',
      }),
      schema: v.string(),
    }),
  },
})

export const boolean = nodes.pure({
  outputs: {
    boolean: i.pins.data({
      displayName: false,
      control: i.controls.switch({
        defaultValue: true,
      }),
      schema: v.boolean(),
    }),
  },
})
