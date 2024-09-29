import { onCleanup, type IntegrationContext } from '@xentom/integration';

const WEBHOOKS: Record<
  string,
  {
    events: Set<string>;
    timeout?: Timer;
  }
> = {};

export interface CreateRepositoryWebhookData {
  owner: string;
  repository: string;
  events: string[];
}

export function createRepositoryWebhook(
  context: IntegrationContext,
  data: CreateRepositoryWebhookData,
) {
  const hook = (WEBHOOKS[`${data.owner}/${data.repository}`] ??= {
    events: new Set(),
  });

  clearTimeout(hook.timeout);

  data.events.forEach((event) => hook.events.add(event));
  hook.timeout = setTimeout(() => {
    async function createWebhooks() {
      try {
        const webhook = await context.state.octokit.rest.repos.createWebhook({
          owner: data.owner,
          repo: data.repository,
          events: [...hook.events],
          config: {
            content_type: 'json',
            url: `${context.http.baseUrl}/webhook`,
            secret: context.state.webhookSecret,
          },
        });

        onCleanup(async () => {
          await context.state.octokit.rest.repos.deleteWebhook({
            owner: data.owner,
            repo: data.repository,
            hook_id: webhook.data.id,
          });
        });
      } catch (error) {
        console.error('Failed to create repository webhook', error);
      }
    }

    createWebhooks();
  }, 500);
}

export interface CreateOrganizationWebhookData {
  organization: string;
  events: string[];
}

export function createOrganizationWebhhok(
  context: IntegrationContext,
  data: CreateOrganizationWebhookData,
) {
  const hook = (WEBHOOKS[data.organization] ??= {
    events: new Set(),
  });

  clearTimeout(hook.timeout);

  data.events.forEach((event) => hook.events.add(event));
  hook.timeout = setTimeout(() => {
    async function createWebhooks() {
      try {
        const webhook = await context.state.octokit.rest.orgs.createWebhook({
          name: 'web',
          org: data.organization,
          events: [...hook.events],
          config: {
            content_type: 'json',
            url: `${context.http.baseUrl}/webhook`,
            secret: context.state.webhookSecret,
          },
        });

        onCleanup(async () => {
          await context.state.octokit.rest.orgs.deleteWebhook({
            org: data.organization,
            hook_id: webhook.data.id,
          });
        });
      } catch (error) {
        console.error('Failed to create organization webhook', error);
      }
    }

    createWebhooks();
  }, 500);
}
