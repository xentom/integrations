import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type components } from '@octokit/openapi-types'

import {
  extractOwnerAndRepo,
  getPagination,
  hasMoreData,
  hasRepositoryNameInput,
} from '@/utils/options'

export const run = i.pins.data<components['schemas']['workflow-run']>({
  displayName: 'Workflow Run',
})

export const runs = i.pins.data<components['schemas']['workflow-run'][]>({
  displayName: 'Workflow Runs',
})

export const workflowId = i.pins.data({
  description: 'The workflow ID or filename (e.g., ci.yml)',
  schema: v.union([
    v.pipe(v.string(), v.nonEmpty()),
    v.pipe(v.number(), v.integer(), v.minValue(1)),
  ]),
  control: i.controls.select({
    placeholder: 'ci.yml',
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return { items: [] }
      }

      const response = await opts.state.octokit.rest.actions.listRepoWorkflows({
        ...extractOwnerAndRepo(opts.node.inputs.repository),
        ...getPagination(opts),
      })

      return {
        hasMore: hasMoreData(response),
        items: response.data.workflows.map((workflow) => ({
          label: workflow.name,
          value: workflow.id,
          suffix: workflow.path,
        })),
      }
    },
  }),
})

export const runId = i.pins.data({
  description: 'The workflow run ID',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.select({
    placeholder: '123456789',
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return { items: [] }
      }

      const response =
        await opts.state.octokit.rest.actions.listWorkflowRunsForRepo({
          ...extractOwnerAndRepo(opts.node.inputs.repository),
          ...getPagination(opts),
        })

      return {
        hasMore: hasMoreData(response),
        items: response.data.workflow_runs.map((run) => ({
          value: run.id,
          suffix: `${run.name ?? 'Workflow'} #${run.run_number}`,
        })),
      }
    },
  }),
})
