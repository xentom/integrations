import * as i from '@xentom/integration-framework'

import * as nodes from './nodes'

declare module '@xentom/integration-framework' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntegrationState {}
}

export default i.integration({
  nodes,
})
