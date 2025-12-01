import * as i from '@xentom/integration-framework'

import { type components } from '@octokit/openapi-types'

import * as pins from '@/pins'
import { extractOwnerAndRepo } from '@/utils/options'

const nodes = i.nodes.group('Repositories/Branches')

export const listBranches = nodes.callable({
  description: 'List repository branches',
  inputs: {
    repository: pins.repository.name,
  },
  outputs: {
    branches: i.pins.data<components['schemas']['short-branch'][]>({
      displayName: 'Branches',
    }),
  },
  async run(opts) {
    const branches = await opts.state.octokit.rest.repos.listBranches({
      ...extractOwnerAndRepo(opts.inputs.repository),
    })

    return opts.next({
      branches: branches.data,
    })
  },
})

export const getBranch = nodes.callable({
  description: 'Get details for a branch',
  inputs: {
    repository: pins.repository.name,
    branch: pins.branch.name,
  },
  outputs: {
    branch: i.pins.data<components['schemas']['branch-with-protection']>({
      displayName: 'Branch',
    }),
  },
  async run(opts) {
    const branch = await opts.state.octokit.rest.repos.getBranch({
      ...extractOwnerAndRepo(opts.inputs.repository),
      branch: opts.inputs.branch,
    })

    return opts.next({
      branch: branch.data,
    })
  },
})

export const createBranch = nodes.callable({
  description: 'Create a new branch from a commit',
  inputs: {
    repository: pins.repository.name,
    branchName: pins.branch.name.with({
      description: 'Name of the new branch (without refs/heads/)',
      control: i.controls.text({
        placeholder: 'feature/new-api',
      }),
    }),
    commitSha: pins.commit.sha,
  },
  outputs: {
    branch: i.pins.data<components['schemas']['git-ref']>({
      displayName: 'Branch Ref',
    }),
  },
  async run(opts) {
    const branch = await opts.state.octokit.rest.git.createRef({
      ...extractOwnerAndRepo(opts.inputs.repository),
      ref: `refs/heads/${opts.inputs.branchName}`,
      sha: opts.inputs.commitSha,
    })

    return opts.next({
      branch: branch.data,
    })
  },
})
