import * as i from '@acme/integration-framework';

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
