import * as i from '@xentom/integration-framework';

import { type components } from '@octokit/openapi-types';

import { extractOwnerAndRepo } from '@/helpers/options';
import * as pins from '@/pins';

const nodes = i.nodes.group('Repositories/Branches');

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
    });

    return opts.next({
      branches: branches.data,
    });
  },
});
