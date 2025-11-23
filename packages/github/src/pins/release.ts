import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type components } from '@octokit/openapi-types'

import { extractOwnerAndRepo, hasRepositoryNameInput } from '@/helpers/options'

export const item = i.pins.data<components['schemas']['release']>({
  displayName: 'Release',
})

export const items = i.pins.data<components['schemas']['release'][]>({
  displayName: 'Releases',
})

export type Action =
  | 'published'
  | 'unpublished'
  | 'created'
  | 'edited'
  | 'deleted'
  | 'prereleased'

export const action = i.pins.data<Action>({
  description: 'The action type of the release',
  control: i.controls.select({
    options: [
      { label: 'Published', value: 'published' },
      { label: 'Unpublished', value: 'unpublished' },
      { label: 'Created', value: 'created' },
      { label: 'Edited', value: 'edited' },
      { label: 'Deleted', value: 'deleted' },
      { label: 'Prereleased', value: 'prereleased' },
    ],
    defaultValue: 'published',
  }),
})

export const id = i.pins.data({
  description: 'The ID of the release',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.select({
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return []
      }

      const releases = await opts.state.octokit.rest.repos.listReleases({
        ...extractOwnerAndRepo(opts.node.inputs.repository),
      })

      return releases.data.map((release) => ({
        label: release.name ?? release.tag_name,
        value: release.id,
        suffix: release.tag_name,
      }))
    },
  }),
})

export const tagName = i.pins.data({
  description: 'The tag name for the release (e.g., v1.0.0)',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'v1.0.0',
  }),
})

export const name = i.pins.data({
  description: 'The release title shown to users',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'July Release',
  }),
})

export const body = i.pins.data({
  description: 'Release notes describing the changes',
  schema: v.string(),
  control: i.controls.text({
    language: i.TextControlLanguage.Markdown,
    placeholder: 'Highlights, fixes, and known issues',
    rows: 3,
  }),
})

export const draft = i.pins.data({
  description: 'Whether the release is a draft',
  schema: v.boolean(),
  control: i.controls.switch(),
})

export const prerelease = i.pins.data({
  description: 'Whether the release is a prerelease',
  schema: v.boolean(),
  control: i.controls.switch(),
})

export const targetCommitish = i.pins.data({
  description: 'Branch or commit SHA to create or update the tag from',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'main',
  }),
})

export const makeLatest = i.pins.data({
  description: 'Whether this release should be marked as the latest',
  schema: v.union([v.literal('true'), v.literal('false'), v.literal('legacy')]),
  control: i.controls.select({
    options: [
      {
        label: 'Mark as latest',
        value: 'true',
      },
      {
        label: 'Do not mark as latest',
        value: 'false',
      },
      {
        label: 'Legacy behavior',
        value: 'legacy',
      },
    ],
  }),
})
