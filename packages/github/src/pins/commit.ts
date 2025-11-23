import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type components } from '@octokit/openapi-types';

import { extractOwnerAndRepo, hasRepositoryNameInput } from '@/helpers/options';

export const item = i.pins.data<components['schemas']['commit']>({
  displayName: 'Commit',
});

export const items = i.pins.data<components['schemas']['commit'][]>({
  displayName: 'Commits',
});

export const sha = i.pins.data({
  description: 'The commit SHA',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    placeholder: 'Commit SHA',
    async options(opts) {
      if (!hasRepositoryNameInput(opts)) {
        return [];
      }

      const commits = await opts.state.octokit.rest.repos.listCommits({
        ...extractOwnerAndRepo(opts.node.inputs.repository),
      });

      return commits.data.map((commit) => ({
        value: commit.sha,
        suffix: commit.commit.message.split('\n')[0] ?? commit.sha,
      }));
    },
  }),
});
