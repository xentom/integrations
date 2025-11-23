import type * as i from '@xentom/integration-framework'

import { extractOwnerAndRepo } from './options'

interface CreateRepositoryWebhookOptions {
  repository: string
  state: i.IntegrationState
  webhook: i.Webhook
}

export async function createRepositoryWebhook(
  options: CreateRepositoryWebhookOptions,
) {
  try {
    await options.state.octokit.rest.repos.createWebhook({
      ...extractOwnerAndRepo(options.repository),
      events: [
        'push',
        'repository',
        'release',
        'issue_comment',
        'issues',
        'pull_request',
        'discussion',
        'discussion_comment',
        'workflow_job',
        'workflow_run',
      ],
      config: {
        url: options.webhook.url,
        secret: options.state.webhookSecret,
        content_type: 'json',
      },
    })
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Hook already exists on this repository')
    ) {
      // Webhook already exists, do nothing
    } else {
      console.error('Error creating webhook:', error)
      throw error
    }
  }
}
