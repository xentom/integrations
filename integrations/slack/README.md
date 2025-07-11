# Slack Integration

A comprehensive Slack integration for the ACME Integration Framework that provides access to core Slack Web API functionality.

## Features

### Chat Operations

- **Post Message** - Send messages to channels, groups, or DMs with full Block Kit support
- **Post Ephemeral** - Send private messages visible only to specific users
- **Delete Message** - Remove messages from conversations
- **Update Message** - Edit existing messages
- **Get Permalink** - Generate permanent links to messages

### Conversation Management

- **List Conversations** - Get all channels, DMs, and group conversations
- **Get Conversation Info** - Retrieve detailed information about specific conversations

### User Management

- **List Users** - Get all users in the workspace
- **Get User Info** - Retrieve detailed user information
- **Lookup by Email** - Find users by their email address

### File Operations

- **List Files** - Browse files in the workspace with filtering options
- **Get File Info** - Retrieve detailed information about specific files

## Setup

### 1. Create a Slack App

1. Go to [Slack API](https://api.slack.com/apps) and create a new app
2. Navigate to "OAuth & Permissions" in your app settings
3. Add the following bot token scopes:
   - `chat:write` - Send messages
   - `chat:write.public` - Send messages to public channels
   - `channels:read` - View basic information about channels
   - `groups:read` - View basic information about private channels
   - `im:read` - View basic information about direct messages
   - `mpim:read` - View basic information about group direct messages
   - `users:read` - View people in the workspace
   - `users:read.email` - View email addresses of people in the workspace
   - `files:read` - View files shared in channels and conversations

### 2. Install the App

1. Click "Install to Workspace" in your app settings
2. Authorize the app for your workspace
3. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 3. Configure the Integration

1. Add the Slack integration to your workflow
2. Paste your Bot User OAuth Token in the "Slack Bot Token" field
3. Save the configuration

## Usage Examples

### Send a Simple Message

Use the **Post Message** node:

- **Channel**: `#general` or `C1234567890`
- **Text**: `Hello, world!`

### Send a Rich Message with Blocks

Use the **Post Message** node with Block Kit:

- **Channel**: `#general`
- **Text**: `Fallback text`
- **Blocks**:

```json
[
  {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "Hello, *world*! :wave:"
    }
  }
]
```

### List All Channels

Use the **List Conversations** node:

- **Types**: `public_channel,private_channel`
- **Exclude Archived**: `true`

### Find a User by Email

Use the **Lookup User by Email** node:

- **Email**: `user@example.com`

## Environment Variables

| Variable          | Description                                | Required |
| ----------------- | ------------------------------------------ | -------- |
| `SLACK_BOT_TOKEN` | Your Slack bot token (starts with `xoxb-`) | Yes      |

## API Client

This integration uses the official [`@slack/web-api`](https://www.npmjs.com/package/@slack/web-api) package, which provides:

- Type-safe API access
- Automatic retry logic
- Built-in rate limiting
- Comprehensive error handling
- Support for all Slack Web API methods

## Troubleshooting

### Authentication Errors

- Verify your bot token is correct and starts with `xoxb-`
- Ensure your app is installed in the workspace
- Check that required scopes are granted to your app

### Permission Errors

- Review the required scopes in the setup section
- Reinstall your app if you've added new scopes
- Ensure your bot is invited to private channels you want to access

### Rate Limiting

The integration automatically handles rate limiting through the official SDK, but be mindful of Slack's API limits for high-volume usage.

## Support

For issues specific to this integration, check the [ACME Integration Framework documentation](https://docs.acme.com). For Slack API questions, refer to the [Slack API documentation](https://api.slack.com).
