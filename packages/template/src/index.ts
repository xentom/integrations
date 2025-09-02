/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as i from '@xentom/integration-framework';

import * as nodes from './nodes';

/**
 * Shared state that persists across all integration resources.
 * This interface defines the structure of data that will be available
 * throughout the integration lifecycle.
 *
 * @example
 * ```ts
 * export interface IntegrationState {
 *   // API clients
 *   client: ApiClient;
 *
 *   // ...
 * }
 * ```
 */
export interface IntegrationState {}

export default i.integration({
  /**
   * Nodes that are available in this integration.
   */
  nodes,

  /**
   * Environment variables that are required by this integration.
   * These variables will be prompted for during integration setup
   * and securely stored for use across all nodes.
   *
   * @example
   * ```ts
   * env: {
   *   API_KEY: i.env({
   *     control: i.controls.text({
   *       label: 'API Key',
   *       description: 'Your service API key for authentication',
   *       placeholder: 'sk-...'
   *       sensitive: true,
   *     })
   *   }),
   * },
   * ```
   */
  env: {},

  /**
   * This function is called when the integration starts.
   * You can initialize shared state or perform setup tasks here.
   *
   * @example
   * ```ts
   * start({ state }) {
   *   state.apiClient = new ApiClient();
   *   console.log('Integration started!');
   * },
   * ```
   */
  start() {},

  /**
   * This function is called when the integration stops.
   * You can clean up resources or save state here.
   *
   * @example
   * ```ts
   * stop({ state }) {
   *   state.apiClient.close();
   * },
   * ```
   */
  stop() {},
});
