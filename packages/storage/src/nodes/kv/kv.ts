import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Key-Value')

export const getValue = nodes.callable({
  description: 'Retrieve a value from persistent storage by its key.',
  inputs: {
    key: pins.storage.key,
  },
  outputs: {
    value: pins.storage.value.output.with({
      description: 'The stored value, or null if the key does not exist.',
      control: false,
    }),
  },
  async run(opts) {
    return opts.next({
      value: await opts.kv.get(opts.inputs.key),
    })
  },
})

export const setValue = nodes.callable({
  description:
    'Store a value in persistent storage. Overwrites any existing value.',
  inputs: {
    key: pins.storage.key,
    value: pins.storage.value.input,
  },
  async run(opts) {
    await opts.kv.set(opts.inputs.key, opts.inputs.value)
    return opts.next()
  },
})

export const deleteValue = nodes.callable({
  description: 'Remove a value from persistent storage by its key.',
  inputs: {
    key: pins.storage.key,
  },
  async run(opts) {
    await opts.kv.delete(opts.inputs.key)
    return opts.next()
  },
})
