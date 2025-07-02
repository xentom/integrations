import * as i from '@acme/integration';

import * as actions from './actions';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IntegrationState {}

export default i.integration({
  actions,
});
