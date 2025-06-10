import { type GenericAction, type InferActionOutput } from '@acme/integration';
import Integration from '../../build/types';

const action = Integration['actions']['onWebhookGeneric'];

type Modify<T, R> = Omit<T, keyof R> & R;

export type NodeInputValues = {
  // Pin connection
  action: import('./node-1').Infer['outputs']['payload']['action'];
};

export type NodeOutputValues = Modify<
  Infer['outputs'],
  {
    // Node output values
  }
>;

export type Variables = {
  action: import('./node-1').Infer['outputs']['payload']['action'];
};

export type Infer = InferActionOutput<
  typeof action extends GenericAction
    ? ReturnType<
        // @ts-ignore
        typeof action._generic<NodeInputValues>
      >
    : typeof action
>;
