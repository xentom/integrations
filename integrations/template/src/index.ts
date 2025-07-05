import * as i from '@acme/integration-framework';

import * as nodes from './nodes';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IntegrationState {}

export default i.integration({
  nodes,
});
