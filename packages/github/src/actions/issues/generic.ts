import {
  actions,
  type Action,
  type InferPinRecordOutput,
  type PinRecord,
} from '@acme/integration';

export type GenericAction<
  A extends GenericActionCallback = GenericActionCallback
> = ReturnType<A> & {
  _infer: A;
};

export type GenericActionCallback = <A = unknown>() => Action;

export function generic<A extends GenericActionCallback>(
  action: A
): GenericAction<A> {
  return action() as any;
}

export type GenericInputs = Record<string, any>;

// export interface WebhookAction<R extends Action = Action> {
//   (): R;
//   _infer: <I>(input: I) => R;
//   // Add other methods that onWebhook might have
// }

// type test = WebhookAction['_infer'];

export interface WebhookAction<R extends Action = Action> {
  (): R;
  _infer: <I>(input: I) => R;
  // Add other methods that onWebhook might have
}

export interface WebhookAction<R extends Action = Action> {
  (): R;
  _infer: <I>(input: I) => R;
}

// Create a helper function type that matches the _infer signature
type InferFunction<I, R> = (input: I) => R;

// Extract the return type
type InferActionOutput<I> = ReturnType<InferFunction<I, any>>;

// Now you can use it
type test<MyInputType> = InferActionOutput<MyInputType>;
