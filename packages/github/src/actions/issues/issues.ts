import {
  actions,
  pins,
  PinType,
  type DataPin,
  type ExecPin,
  type InferPinRecordOutput,
  type PinRecord,
} from '@acme/integration';
import * as v from 'valibot';
import { repositoryFullName } from '../../pins';
import { createRepositoryWebhook } from '../../helpers/webhooks';
import { type WebhookEventDefinition } from '@octokit/webhooks/types';
import { type EmitterWebhookEvent } from '@octokit/webhooks';
import type { StandardSchemaV1 } from '@standard-schema/spec';

function generic<T>(pins: () => T) {
  return pins();
}

const result = generic(<T extends '333'>() => ({
  test: '555' as T,
}));

export const test = {
  inputs: {
    // repository: repositoryFullName,
    action: pins.data({
      schema: v.picklist(['issues-closed', 'repository-created']),
    }),
  },

  test: {} as typeof this.inputs,

  outputs<I extends InferPinRecordOutput<typeof this.inputs>>() {
    return {
      payload: pins.data({
        schema: v.custom<WebhookEventDefinition<I['action']>>(() => true),
      }),
    };
  },

  // outputs: {
  //   payload: <E extends Events>() =>
  //     pins.data({
  //       displayName: 'Payload',
  //       description: 'A push event from GitHub',
  //       schema: v.custom<WebhookEventDefinition<E>>(() => true),
  //     }),

  //   v1: generic(<T extends Events>() =>
  //     pins.data({
  //       schema: v.custom<WebhookEventDefinition<T>>(() => true),
  //     })
  //   ),

  //   v2: newPins.data(<T extends Events>() => ({
  //     schema: v.custom<WebhookEventDefinition<T>>(() => true),
  //   })),
  // },

  async subscribe({ state, inputs, webhook, next }) {
    state.webhooks.on('check_run.completed', ({ payload }) => {
      if (payload.repository.full_name !== inputs.repository) {
        return;
      }

      next({ payload });
    });

    await createRepositoryWebhook({
      repository: inputs.repository,
      webhook,
      state,
    });
  },
};

test.outputs<{
  action: 'repository-created';
}>().payload;

type inputs = typeof test.inputs;

type test1 = ReturnType<typeof test.outputs<'repository-created'>>;

type test22 = test1 extends StandardSchemaV1<infer U> ? U : never;

export const onRepositoryIssue = actions.trigger({
  inputs: {
    repository: repositoryFullName,
    action: pins.data({
      schema: v.optional(
        v.picklist([
          'all',
          'assigned',
          'closed',
          'deleted',
          'demilestoned',
          'edited',
          'labeled',
          'locked',
          'milestoned',
          'opened',
          'pinned',
          'reopened',
          'transferred',
          'typed',
          'unassigned',
          'unlabeled',
          'unlocked',
          'unpinned',
          'untyped',
        ]),
        'all'
      ),
    }),
  },

  outputs: {
    payload: pins.data({
      displayName: 'Payload',
      description: 'A push event from GitHub',
      schema: v.custom<EmitterWebhookEvent<'issues'>['payload']>(() => true),
    }),
  },

  async subscribe({ state, inputs, webhook, next }) {
    state.webhooks.on('issues', ({ payload }) => {
      payload.action;
      payload.action;
    });

    await createRepositoryWebhook({
      repository: inputs.repository,
      webhook,
      state,
    });
  },
});
