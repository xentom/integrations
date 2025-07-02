import type * as i from '@acme/integration';

interface CreateRepositoryWebhookOptions {
  repository: string;
  state: i.IntegrationState;
  webhook: i.Webhook;
}

export async function createRepositoryWebhook(
  options: CreateRepositoryWebhookOptions,
) {
  try {
    const [owner, repository] = options.repository.split('/') as [
      string,
      string,
    ];

    await options.state.octokit.rest.repos.createWebhook({
      owner: owner,
      repo: repository,
      events: ['push', 'repository', 'issues'],
      config: {
        url: options.webhook.url,
        secret: options.state.webhookSecret,
        content_type: 'json',
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Hook already exists on this repository')
    ) {
      // Webhook already exists, do nothing
    } else {
      console.error('Error creating webhook:', error);
      throw error;
    }
  }
}
