import * as i from '@xentom/integration-framework';

const nodes = i.nodes.group('Workflows');

export const onWorkflowStart = nodes.trigger({
  subscribe(opts) {
    void opts.next();
  },
});

export const onWorkflowEnd = nodes.trigger({
  subscribe(opts) {
    return async () => {
      await opts.next();
    };
  },
});
