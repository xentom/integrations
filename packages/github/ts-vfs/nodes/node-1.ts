import {
  type GenericAction,
  type InferPinRecordOutput,
} from '@acme/integration';
import Integration from '../../build/types';

export const action = Integration['actions']['onIssue'];

type Modify<T, R> = Omit<T, keyof R> & R;

export type NodeInputValues = Modify<
  InferPinRecordOutput<NonNullable<typeof action.inputs>>,
  {
    actionType: 'locked';
  }
>;

export type NodeOutputValues = InferPinRecordOutput<
  NonNullable<
    (typeof action extends GenericAction
      ? ReturnType<typeof action._generic<NodeInputValues>>
      : typeof action)['outputs']
  >
>;

export type NodeVariables = {};

type demo = NodeOutputValues['payload']['action'];

declare const test: demo;
