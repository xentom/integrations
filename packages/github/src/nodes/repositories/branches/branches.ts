import * as i from '@xentom/integration-framework';

import { type components } from '@octokit/openapi-types';

import { extractOwnerAndRepo } from '@/helpers/options';
import * as pins from '@/pins';

const category = {
  path: ['Repositories', 'Branches'],
} satisfies i.NodeCategory;

export const listBranches = i.nodes.callable({
  category,
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
    });

    return opts.next({
      branches: branches.data,
    });
  },
});
