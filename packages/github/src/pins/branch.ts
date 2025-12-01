import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  extractOwnerAndRepo,
  getPagination,
  hasMoreData,
  hasRepositoryNameInput,
} from '@/utils/options'

export const name = i.pins.data({
  description: 'The branch name',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return { items: [] }
      }

      const branches = await opts.state.octokit.rest.repos.listBranches({
        ...extractOwnerAndRepo(opts.node.inputs.repository),
        ...getPagination(opts),
      })

      return {
        hasMore: hasMoreData(branches),
        items: branches.data.map((branch) => ({
          value: branch.name,
        })),
      }
    },
  }),
})
