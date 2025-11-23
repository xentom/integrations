import * as i from '@xentom/integration-framework';

import { extractOwnerAndRepo } from '@/helpers/options';
import * as pins from '@/pins';

const nodes = i.nodes.group('Repositories/Releases');

export const createRelease = nodes.callable({
  description: 'Create a new release',
  inputs: {
    repository: pins.repository.name,
    tagName: pins.release.tagName,
    targetCommitish: pins.release.targetCommitish.with({
      optional: true,
    }),
    name: pins.release.name.with({
      optional: true,
    }),
    body: pins.release.body.with({
      optional: true,
    }),
    draft: pins.release.draft.with({
      optional: true,
    }),
    prerelease: pins.release.prerelease.with({
      optional: true,
    }),
  },
  outputs: {
    release: pins.release.item,
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.createRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
      tag_name: opts.inputs.tagName,
      target_commitish: opts.inputs.targetCommitish,
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

export const updateRelease = nodes.callable({
  description: 'Update an existing release',
  inputs: {
    repository: pins.repository.name,
    releaseId: pins.release.id,
    tagName: pins.release.tagName.with({
      optional: true,
    }),
    targetCommitish: pins.release.targetCommitish.with({
      optional: true,
    }),
    name: pins.release.name.with({
      optional: true,
    }),
    body: pins.release.body.with({
      optional: true,
    }),
    draft: pins.release.draft.with({
      optional: true,
    }),
    prerelease: pins.release.prerelease.with({
      optional: true,
    }),
    makeLatest: pins.release.makeLatest.with({
      optional: true,
    }),
  },
  outputs: {
    release: pins.release.item,
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.updateRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
      release_id: opts.inputs.releaseId,
      tag_name: opts.inputs.tagName,
      target_commitish: opts.inputs.targetCommitish,
      name: opts.inputs.name,
      body: opts.inputs.body,
      draft: opts.inputs.draft,
      prerelease: opts.inputs.prerelease,
      make_latest: opts.inputs.makeLatest,
    });

    return opts.next({
      release: release.data,
    });
  },
});
