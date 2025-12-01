import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type components } from '@octokit/openapi-types'

import * as general from '@/pins/general'
import {
  extractOwnerAndRepo,
  getPagination,
  hasMoreData,
  hasRepositoryNameInput,
} from '@/utils/options'

export const item = i.pins.data<components['schemas']['issue']>({
  displayName: 'Issue',
})

export const items = i.pins.data<components['schemas']['issue'][]>({
  displayName: 'Issues',
})

export type Action =
  | 'assigned'
  | 'closed'
  | 'deleted'
  | 'demilestoned'
  | 'edited'
  | 'labeled'
  | 'locked'
  | 'milestoned'
  | 'opened'
  | 'pinned'
  | 'reopened'
  | 'transferred'
  | 'typed'
  | 'unassigned'
  | 'unlabeled'
  | 'unlocked'
  | 'unpinned'
  | 'untyped'

export const action = i.pins.data<Action>({
  description: 'The action type of the issue',
  control: i.controls.select({
    options: [
      {
        label: 'Assigned',
        value: 'assigned',
      },
      {
        label: 'Closed',
        value: 'closed',
      },
      {
        label: 'Deleted',
        value: 'deleted',
      },
      {
        label: 'Demilestoned',
        value: 'demilestoned',
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
        label: 'Milestoned',
        value: 'milestoned',
      },
      {
        label: 'Opened',
        value: 'opened',
      },
      {
        label: 'Pinned',
        value: 'pinned',
      },
      {
        label: 'Reopened',
        value: 'reopened',
      },
      {
        label: 'Transferred',
        value: 'transferred',
      },
      {
        label: 'Typed',
        value: 'typed',
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
      {
        label: 'Unpinned',
        value: 'unpinned',
      },
      {
        label: 'Untyped',
        value: 'untyped',
      },
    ],
    defaultValue: 'opened',
  }),
})

export const title = i.pins.data({
  description: 'The title of the issue',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'Issue title',
  }),
})

export const body = general.markdown.with({
  description: 'The body content of the issue',
})

export const number = i.pins.data({
  description: 'The issue number',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})

export const labels = i.pins.data({
  description: 'Labels to assign to the issue',
  schema: v.array(v.string()),
  control: i.controls.select({
    multiple: true,
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return { items: [] }
      }

      const labels = await opts.state.octokit.rest.issues.listLabelsForRepo({
        ...extractOwnerAndRepo(opts.node.inputs.repository),
        ...getPagination(opts),
      })

      return {
        hasMore: hasMoreData(labels),
        items: labels.data.map((label) => ({
          label: label.name,
          value: label.name,
        })),
      }
    },
  }),
})

export const assignees = i.pins.data({
  description: 'Users to assign to the issue',
  schema: v.array(v.string()),
  control: i.controls.select({
    multiple: true,
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return { items: [] }
      }

      const collaborators =
        await opts.state.octokit.rest.repos.listCollaborators({
          ...extractOwnerAndRepo(opts.node.inputs.repository),
          ...getPagination(opts),
        })

      return {
        hasMore: hasMoreData(collaborators),
        items: collaborators.data.map((collaborator) => ({
          label: collaborator.login,
          value: collaborator.login,
        })),
      }
    },
  }),
})

export const state = i.pins.data({
  description: 'The state of the issue',
  schema: v.union([v.literal('open'), v.literal('closed')]),
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
