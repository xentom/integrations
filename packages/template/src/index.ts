import { createIntegration } from '@xentom/integration';
import * as actions from './actions';

// declare module '@xentom/integration' {
//   interface IntegrationState {
//   }
// }

export default createIntegration({
  actions,
});
