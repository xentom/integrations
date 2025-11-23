import { type pubsub_v1 } from 'googleapis/build/src/apis/pubsub/v1'

import { isGaxiosError } from './response'

export interface CreateTopicOptions {
  projectId: string
  topicName: string
}

/**
 * Creates a Pub/Sub topic for Gmail notifications
 * @param pubsub - Google Pub/Sub API client
 * @param options - Topic creation options
 */
export async function createTopic(
  pubsub: pubsub_v1.Pubsub,
  options: CreateTopicOptions,
): Promise<string> {
  const topicPath = `projects/${options.projectId}/topics/${options.topicName}`

  try {
    // Check if topic already exists
    await pubsub.projects.topics.get({ topic: topicPath })
    console.log(`Topic ${options.topicName} already exists`)

    // Still need to ensure Gmail service account has permissions
    await setTopicPermissions(pubsub, { topicPath })
    return topicPath
  } catch (error) {
    if (!isGaxiosError(error)) {
      throw error
    }

    if (error.code === 404) {
      // Topic doesn't exist, create it
      try {
        await pubsub.projects.topics.create({
          name: topicPath,
          requestBody: {},
        })
        console.log(`Topic ${options.topicName} created successfully`)

        // Set permissions for Gmail service account
        await setTopicPermissions(pubsub, { topicPath })
        return topicPath
      } catch (error) {
        if (!isGaxiosError(error)) {
          throw error
        }

        if (
          error.message.includes("If the topic's project was recently created")
        ) {
          throw new Error(
            'The project was recently created, please wait a few minutes and try again...',
          )
        }

        throw new Error(`Failed to create topic: ${error.message}`)
      }
    } else {
      throw error
    }
  }
}

export interface SetTopicPermissionsOptions {
  topicPath: string
}

/**
 * Sets IAM permissions on the topic for Gmail service account
 * @param pubsub - Google Pub/Sub API client
 * @param options - Permission setting options
 */
export async function setTopicPermissions(
  pubsub: pubsub_v1.Pubsub,
  options: SetTopicPermissionsOptions,
): Promise<void> {
  const GMAIL_SERVICE_ACCOUNT = 'gmail-api-push@system.gserviceaccount.com'
  const PUBLISHER_ROLE = 'roles/pubsub.publisher'

  try {
    // Get current IAM policy
    const response = await pubsub.projects.topics.getIamPolicy({
      resource: options.topicPath,
    })

    const policy = response.data

    // Check if Gmail service account already has publisher role
    const existingBinding = policy.bindings?.find(
      (binding) => binding.role === PUBLISHER_ROLE,
    )

    if (existingBinding) {
      // Check if Gmail service account is already in the members
      if (
        !existingBinding.members?.includes(
          `serviceAccount:${GMAIL_SERVICE_ACCOUNT}`,
        )
      ) {
        existingBinding.members = existingBinding.members || []
        existingBinding.members.push(`serviceAccount:${GMAIL_SERVICE_ACCOUNT}`)
      } else {
        console.log('Gmail service account already has publisher permissions')
        return
      }
    } else {
      // Create new binding for publisher role
      policy.bindings = policy.bindings || []
      policy.bindings.push({
        role: PUBLISHER_ROLE,
        members: [`serviceAccount:${GMAIL_SERVICE_ACCOUNT}`],
      })
    }

    // Set the updated IAM policy
    await pubsub.projects.topics.setIamPolicy({
      resource: options.topicPath,
      requestBody: {
        policy: policy,
      },
    })

    console.log(
      `Gmail service account granted publisher permissions on ${options.topicPath}`,
    )
  } catch (error) {
    if (!isGaxiosError(error)) {
      throw error
    }

    throw new Error(`Failed to set topic permissions: ${error.message}`)
  }
}

export interface CreateSubscriptionOptions {
  projectId: string
  subscriptionName: string
  topicPath: string
  pushEndpoint: string
}

/**
 * Creates a Pub/Sub subscription for the topic
 * @param pubsub - Google Pub/Sub API client
 * @param options - Subscription creation options
 */
export async function createSubscription(
  pubsub: pubsub_v1.Pubsub,
  options: CreateSubscriptionOptions,
): Promise<string> {
  const subscriptionPath = `projects/${options.projectId}/subscriptions/${options.subscriptionName}`

  try {
    // Check if subscription already exists
    await pubsub.projects.subscriptions.get({ subscription: subscriptionPath })
    console.log(`Subscription ${options.subscriptionName} already exists`)
    return subscriptionPath
  } catch (error) {
    if (!isGaxiosError(error)) {
      throw error
    }

    if (error.code === 404) {
      // Subscription doesn't exist, create it
      try {
        await pubsub.projects.subscriptions.create({
          name: subscriptionPath,
          requestBody: {
            topic: options.topicPath,
            pushConfig: {
              pushEndpoint: options.pushEndpoint,
            },
          },
        })

        console.log(
          `Subscription ${options.subscriptionName} created successfully`,
        )
        return subscriptionPath
      } catch (error) {
        if (!isGaxiosError(error)) {
          throw error
        }

        throw new Error(`Failed to create subscription: ${error.message}`)
      }
    } else {
      throw error
    }
  }
}
