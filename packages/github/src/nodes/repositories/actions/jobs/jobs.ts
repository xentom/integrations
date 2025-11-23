import * as i from '@xentom/integration-framework';

import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import { extractOwnerAndRepo } from '@/helpers/options';
import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const nodes = i.nodes.group('Repositories/Actions/Jobs');

export const onActionJob = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    repository: pins.repository.name,
    action: pins.action.job.action,
  };

  type WebhookEvent = EmitterWebhookEvent<`workflow_job.${I['action']}`>;

  return nodes.trigger({
    inputs,
    outputs: {
      id: i.pins.data<WebhookEvent['id']>(),
      payload: i.pins.data<WebhookEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `workflow_job.${opts.inputs.action}`,
        ({ id, payload }) => {
          if (payload.repository.full_name !== opts.inputs.repository) {
            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            id,
            payload,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        },
      );

      await createRepositoryWebhook({
        repository: opts.inputs.repository,
        webhook: opts.webhook,
        state: opts.state,
      });
    },
  });
});

export const listWorkflowJobs = nodes.callable({
  description: 'List jobs for a workflow run',
  inputs: {
    repository: pins.repository.name,
    runId: pins.action.workflow.runId,
  },
  outputs: {
    jobs: pins.action.job.items,
  },
  async run(opts) {
    const jobs = await opts.state.octokit.rest.actions.listJobsForWorkflowRun({
      ...extractOwnerAndRepo(opts.inputs.repository),
      run_id: opts.inputs.runId,
    });

    return opts.next({
      jobs: jobs.data.jobs,
    });
  },
});
