import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

export const fullName = i.pins.data({
  description: 'The full name of the repository (e.g., octocat/Hello-World)',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    async options(opts) {
      const repositories =
        await opts.state.octokit.rest.repos.listForAuthenticatedUser();

      return repositories.data.map((repo) => ({
        value: repo.full_name,
      }));
    },
  }),
});
