import type { IntegrationState, Webhook } from '@acme/integration';

interface CreateRepositoryWebhookOptions {
  repository: string;
  state: IntegrationState;
  webhook: Webhook;
}

export async function createRepositoryWebhook(
  options: CreateRepositoryWebhookOptions
) {
  try {
    const [owner, repository] = options.repository.split('/');
    await options.state.octokit.rest.repos.createWebhook({
      owner: owner,
      repo: repository,
      events: ['push'],
      config: {
        url: options.webhook.url,
        secret: options.state.webhookSecret,
        content_type: 'json',
      },
    });
  } catch (error) {
    console.error('Error creating webhook:', error);
    if (
      error instanceof Error &&
      error.message.includes('Hook already exists on this repository')
    ) {
      // Webhook already exists, do nothing
    } else {
      throw error;
    }
  }
}
