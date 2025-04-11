import {
  actions,
  pins,
  type Action,
  type InferActionOutput,
} from '@acme/integration';
import { type WebhookEventDefinition } from '@octokit/webhooks/types';
import * as v from 'valibot';
import { generic, type GenericInputs, type WebhookAction } from './generic';

const onWebhook = generic(<T extends GenericInputs>() => {
  return actions.trigger({
    inputs: {
      action: pins.data({
        schema: v.picklist(['issues', 'repositories']),
      }),
    },

    outputs: {
      payload: pins.data({
        schema: v.custom<WebhookEventDefinition<T['action']>>(() => true),
      }),
    },

    subscribe({ state, inputs, next }) {},
  });
});

type Inputs = {
  action: 'issues-opened';
};

// type InferGenericOutput<>

type Outputs = InferActionOutput<ReturnType<typeof onWebhook._infer<Inputs>>>;

const test2: Outputs['outputs'] = {} as Outputs['outputs'];

test2.payload.action;


type test = WebhookAction<typeof onWebhook>;
type test2 = test['_infer']

const demo: test2<number> = () => 