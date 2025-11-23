import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type components } from '@octokit/openapi-types'

import { extractOwnerAndRepo, hasRepositoryNameInput } from '@/helpers/options'
import * as branch from '@/pins/branch'
import * as general from '@/pins/general'

export const title = i.pins.data({
  description: 'The title of the pull request',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text(),
})

export const body = general.markdown.with({
  description: 'The body content of the pull request',
})

export const number = i.pins.data({
  description: 'The pull request number',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.select({
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return []
      }

      const pullRequests = await opts.state.octokit.rest.pulls.list({
        ...extractOwnerAndRepo(opts.node.inputs.repository),
      })

      return pullRequests.data.map((pullRequest) => ({
        value: pullRequest.number,
        suffix: pullRequest.title,
      }))
    },
  }),
})

export const head = branch.name.with({
  description: 'The head branch name (source branch)',
})

export const base = branch.name.with({
  description: 'The base branch name (target branch)',
})

export const state = i.pins.data({
  description: 'The state of the pull request',
  schema: v.union([v.literal('closed'), v.literal('open')]),
  control: i.controls.select({
    options: [
      {
        label: 'Open',
        value: 'open',
      },
      {
        label: 'Closed',
        value: 'closed',
      },
    ],
  }),
})

export const draft = i.pins.data({
  description: 'Whether the pull request is a draft',
  schema: v.boolean(),
  control: i.controls.switch(),
})

export const item = i.pins.data<components['schemas']['pull-request']>({
  displayName: 'Pull Request',
})

export const items = i.pins.data<
  components['schemas']['pull-request-simple'][]
>({
  displayName: 'Pull Requests',
})

export type Action =
  | 'assigned'
  | 'auto_merge_disabled'
  | 'auto_merge_enabled'
  | 'closed'
  | 'converted_to_draft'
  | 'edited'
  | 'labeled'
  | 'locked'
  | 'opened'
  | 'ready_for_review'
  | 'reopened'
  | 'review_request_removed'
  | 'review_requested'
  | 'synchronize'
  | 'unassigned'
  | 'unlabeled'
  | 'unlocked'

export const action = i.pins.data<Action>({
  description: 'The action type of the pull request',
  control: i.controls.select({
    options: [
      {
        label: 'Assigned',
        value: 'assigned',
      },
      {
        label: 'Auto Merge Disabled',
        value: 'auto_merge_disabled',
      },
      {
        label: 'Auto Merge Enabled',
        value: 'auto_merge_enabled',
      },
      {
        label: 'Closed',
        value: 'closed',
      },
      {
        label: 'Converted To Draft',
        value: 'converted_to_draft',
      },
      {
        label: 'Edited',
        value: 'edited',
      },
      {
        label: 'Labeled',
        value: 'labeled',
      },
      {
        label: 'Locked',
        value: 'locked',
      },
      {
        label: 'Opened',
        value: 'opened',
      },
      {
        label: 'Ready For Review',
        value: 'ready_for_review',
      },
      {
        label: 'Reopened',
        value: 'reopened',
      },
      {
        label: 'Review Request Removed',
        value: 'review_request_removed',
      },
      {
        label: 'Review Requested',
        value: 'review_requested',
      },
      {
        label: 'Synchronize',
        value: 'synchronize',
      },
      {
        label: 'Unassigned',
        value: 'unassigned',
      },
      {
        label: 'Unlabeled',
        value: 'unlabeled',
      },
      {
        label: 'Unlocked',
        value: 'unlocked',
      },
    ],
  }),
})
