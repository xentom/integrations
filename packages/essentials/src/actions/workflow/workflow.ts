import * as i from '@acme/integration';

const category = {
  path: ['Workflow', 'Triggers'],
} satisfies i.ActionCategory;

export const onWorkflowStart = i.trigger({
  category,
  displayName: 'Workflow Start',
  subscribe(opts) {
    void opts.next();
  },
});
