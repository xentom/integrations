import * as i from '@xentom/integration-framework'

const nodes = i.nodes.group('Workflows')

export const onWorkflowStart = nodes.trigger({
  subscribe(opts) {
    return opts.workflow.on('start', () => {
      void opts.next()
    })
  },
})
