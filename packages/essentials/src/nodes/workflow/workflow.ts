import * as i from '@xentom/integration-framework';

const category = {
  path: ['Workflow'],
} satisfies i.NodeCategory;

export const onStart = i.nodes.trigger({
  category,
  subscribe(opts) {
    void opts.next();
  },
});

export const onEnd = i.nodes.trigger({
  category,
  subscribe(opts) {
    return async () => {
      await opts.next();
    };
  },
});
