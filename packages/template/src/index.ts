import * as i from '@xentom/integration-framework';

import * as nodes from './nodes';

export interface IntegrationState {
  client: unknown;
}

export default i.integration({
  nodes,
});
