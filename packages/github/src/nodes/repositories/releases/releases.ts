import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type components } from '@octokit/openapi-types';

import { extractOwnerAndRepo } from '@/helpers/options';
import * as pins from '@/pins';

const category = {
  path: ['Repositories', 'Releases'],
} satisfies i.NodeCategory;

export const createRelease = i.nodes.callable({
  category,
  description: 'Create a new release',
  inputs: {
    repository: pins.repository.name,
    tagName: i.pins.data({
      description: 'The name of the tag',
      schema: v.pipe(v.string(), v.nonEmpty()),
    }),
    name: i.pins.data({
      description: 'The name of the release',
      schema: v.string(),
      optional: true,
    }),
    body: i.pins.data({
      description: 'Text describing the contents of the tag',
      schema: v.string(),
      optional: true,
    }),
    draft: i.pins.data({
      description: 'Whether the release is a draft',
      schema: v.boolean(),
      optional: true,
    }),
    prerelease: i.pins.data({
      description: 'Whether the release is a prerelease',
      schema: v.boolean(),
      optional: true,
    }),
  },
  outputs: {
    release: i.pins.data<components['schemas']['release']>({
      displayName: 'Release',
    }),
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.createRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
      tag_name: opts.inputs.tagName,
      name: opts.inputs.name,
      body: opts.inputs.body,
      draft: opts.inputs.draft,
      prerelease: opts.inputs.prerelease,
    });

    return opts.next({
      release: release.data,
    });
  },
});
