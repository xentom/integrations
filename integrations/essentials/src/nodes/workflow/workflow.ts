import * as i from '@acme/integration-framework';

const category = {
  path: ['Workflow', 'Triggers'],
} satisfies i.NodeCategory;

export const onWorkflowStart = i.nodes.trigger({
  category,
  displayName: 'Workflow Start',
  subscribe(opts) {
    void opts.next();
  },
});
