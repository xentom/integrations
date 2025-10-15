# Slack Integration

## Overview

The Slack integration allows you to send messages to Slack channels and groups.

## Setup

This guide walks through the Slack configuration required before installing the integration.

### 1. Create a Slack OAuth app

1. Visit [https://api.slack.com/apps](https://api.slack.com/apps) and sign in with your Slack account.
2. Select **Create New App**, then choose **From scratch**.
3. Provide an app name (for example, `Xentom`) and choose the workspace that will host the integration.
4. After the app is created, open **Basic Information** and make note of the **Client ID** and **Client Secret**. You will need these values when configuring the integration in Xentom.

### 2. Enable Socket Mode

1. Open the **Socket Mode** page in your Slack app configuration and turn **Enable Socket Mode** on.
2. A modal will appear to create a new app level token. Enter a name for the token and make sure the scopes include `connections:write`. Click **Generate** and copy the token.

### 3. Configure OAuth and redirects

1. Under **OAuth & Permissions**, go to the **Redirect URLs** section. Click **Add New Redirect URL**, paste the following callback URL, and save your changes:

   [{{ endpoints.redirect }}]({{ endpoints.redirect }}) (Your external URL)

2. In the **Bot Token Scopes** section, add the following scopes:
   - `chat:write`
   - `channels:read`
   - `groups:read`

### 4. Enable Event Subscriptions

1. Under **Event Subscriptions**, turn **Enable Events** on.
2. In the **Subscribe to bot events** section, add the following events:
   - `message.channels`

### 5. Provide credentials to the integration

1. In the Workflow Editor, find the Slack integration and click **Configure**.
2. Open the **Configuration** tab.
   1. Set the **Client ID** and **Client Secret**
      1. Under **Authentication > Connection**, open the dropdown menu and create a new connection.
      2. Enter the **Client ID** and **Client Secret** from your Slack app.
      3. Click **Connect** and complete the authentication process.
   2. Set the **App Level Token**
      1. Under **Environment Variables**, add the **App Level Token**.
