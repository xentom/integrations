import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

const nodes = i.nodes.group('Data types/Primitives')

export const number = nodes.pure({
  outputs: {
    number: i.pins.data({
      displayName: false,
      control: i.controls.number({
        default: 0,
      }),
    }),
  },
})

export const string = nodes.pure({
  outputs: {
    string: i.pins.data({
      displayName: false,
      control: i.controls.text({
        default: '',
      }),
      schema: v.string(),
    }),
  },
})

export const boolean = nodes.pure({
  outputs: {
    boolean: i.pins.data({
      displayName: false,
      control: i.controls.boolean({
        default: true,
      }),
      schema: v.boolean(),
    }),
  },
})

export const object = nodes.pure({
  outputs: {
    object: i.pins.data({
      displayName: false,
      control: i.controls.object({
        default: {},
      }),
    }),
  },
})

export const array = nodes.pure({
  outputs: {
    array: i.pins.data({
      displayName: false,
      control: i.controls.object({
        default: [],
      }),
      schema: v.array(v.any()),
    }),
  },
})
