import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import { extractOwnerAndRepo } from '@/helpers/options';
import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const nodes = i.nodes.group('Repositories/Actions/Runs');

export const onActionRun = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    repository: pins.repository.name,
    action: pins.action.run.action,
  };

  type WebhookEvent = EmitterWebhookEvent<`workflow_run.${I['action']}`>;

  return nodes.trigger({
    inputs,
    outputs: {
      id: i.pins.data<WebhookEvent['id']>(),
      payload: i.pins.data<WebhookEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `workflow_run.${opts.inputs.action}`,
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

export const listWorkflowRuns = nodes.callable({
  description: 'List workflow runs for a repository',
  inputs: {
    repository: pins.repository.name,
    workflowId: pins.action.workflow.workflowId.with({
      optional: true,
    }),
  },
  outputs: {
    runs: pins.action.workflow.runs,
  },
  async run(opts) {
    const ownerRepo = extractOwnerAndRepo(opts.inputs.repository);
    const runs =
      opts.inputs.workflowId === undefined
        ? await opts.state.octokit.rest.actions.listWorkflowRunsForRepo(
            ownerRepo,
          )
        : await opts.state.octokit.rest.actions.listWorkflowRuns({
            ...ownerRepo,
            workflow_id: opts.inputs.workflowId,
          });

    return opts.next({
      runs: runs.data.workflow_runs,
    });
  },
});

export const getWorkflowRun = nodes.callable({
  description: 'Get a workflow run',
  inputs: {
    repository: pins.repository.name,
    runId: pins.action.workflow.runId,
  },
  outputs: {
    run: pins.action.workflow.run,
  },
  async run(opts) {
    const run = await opts.state.octokit.rest.actions.getWorkflowRun({
      ...extractOwnerAndRepo(opts.inputs.repository),
      run_id: opts.inputs.runId,
    });

    return opts.next({
      run: run.data,
    });
  },
});

export const cancelWorkflowRun = nodes.callable({
  description: 'Cancel a running workflow run',
  inputs: {
    repository: pins.repository.name,
    runId: pins.action.workflow.runId,
  },
  outputs: {
    cancelled: i.pins.data<boolean>({
      description: 'Whether the run was requested to cancel',
    }),
  },
  async run(opts) {
    await opts.state.octokit.rest.actions.cancelWorkflowRun({
      ...extractOwnerAndRepo(opts.inputs.repository),
      run_id: opts.inputs.runId,
    });

    return opts.next({
      cancelled: true,
    });
  },
});

export const rerunWorkflow = nodes.callable({
  description: 'Request a rerun of a workflow run',
  inputs: {
    repository: pins.repository.name,
    runId: pins.action.workflow.runId,
    enableDebugLogging: i.pins.data({
      description: 'Enable debug logging for the rerun',
      schema: v.boolean(),
      control: i.controls.switch(),
      optional: true,
    }),
  },
  outputs: {
    rerunRequested: i.pins.data<boolean>({
      description: 'Whether the rerun was requested',
    }),
  },
  async run(opts) {
    await opts.state.octokit.rest.actions.reRunWorkflow({
      ...extractOwnerAndRepo(opts.inputs.repository),
      run_id: opts.inputs.runId,
      enable_debug_logging: opts.inputs.enableDebugLogging,
    });

    return opts.next({
      rerunRequested: true,
    });
  },
});
