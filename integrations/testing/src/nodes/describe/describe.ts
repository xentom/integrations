import * as i from '@xentom/integration-framework';

const category = {
  path: ['Testing', 'Describe'],
} satisfies i.NodeCategory;

export const describe = i.nodes.trigger({
  category,
  description: 'Describe a test',

  subscribe(opts) {
    void opts.next();
  },
});

export const passthrough = i.nodes.callable({
  category,
  description: 'Pass through the data.',
  inputs: {
    data: i.pins.data({
      description: 'The data to pass through.',
    }),
  },
  outputs: {
    data: i.pins.data({
      description: 'The data to pass through.',
    }),
  },
  run(opts) {
    return opts.next({
      data: opts.inputs.data,
    });
  },
});
