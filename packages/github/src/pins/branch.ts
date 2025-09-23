import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { extractOwnerAndRepo, hasRepositoryNameInput } from '@/helpers/options';

export const name = i.pins.data({
  description: 'The branch name',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return [];
      }

      const branches = await opts.state.octokit.rest.repos.listBranches({
        ...extractOwnerAndRepo(opts.node.inputs.repository),
      });

      return branches.data.map((branch) => ({
        value: branch.name,
      }));
    },
  }),
});
