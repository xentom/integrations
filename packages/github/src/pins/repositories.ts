import { controls, pins } from '@acme/integration';
import * as v from 'valibot';

export const repositoryFullName = pins.data({
  description: 'The full name of the repository (e.g., octocat/Hello-World)',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: controls.select({
    async options({ state }) {
      const repositories =
        await state.octokit.rest.repos.listForAuthenticatedUser();

      return repositories.data.map((repo) => ({
        label: repo.full_name,
        value: repo.full_name,
      }));
    },
  }),
});
