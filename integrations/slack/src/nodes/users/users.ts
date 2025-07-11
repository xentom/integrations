import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Users'],
} satisfies i.NodeCategory;

export const listUsers = i.nodes.callable({
  category,
  description: 'List all users in a Slack workspace.',

  inputs: {
    limit: pins.common.limit.with({
      description: 'The maximum number of items to return.',
    }),
    cursor: pins.common.cursor.with({
      description:
        'Paginate through collections by providing the next_cursor value.',
    }),
    includeLocale: pins.user.includeLocale.with({
      description: 'Set this to true to receive the locale for users.',
    }),
    teamId: pins.user.teamId.with({
      description: 'Team ID for Enterprise Grid.',
    }),
  },

  outputs: {
    response: pins.user.usersListResponse.with({
      description: 'List of users.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.users.list({
      limit: opts.inputs.limit,
      cursor: opts.inputs.cursor,
      include_locale: opts.inputs.includeLocale,
      team_id: opts.inputs.teamId,
    });

    if (!response.ok) {
      throw new Error(`Failed to list users: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getUserInfo = i.nodes.callable({
  category,
  description: 'Get information about a user.',

  inputs: {
    user: pins.user.userId.with({
      description: 'User to get info on.',
    }),
    includeLocale: pins.user.includeLocale.with({
      description: 'Set this to true to receive the locale for this user.',
    }),
  },

  outputs: {
    response: pins.user.userInfoResponse.with({
      description: 'Information about the user.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.users.info({
      user: opts.inputs.user,
      include_locale: opts.inputs.includeLocale,
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const lookupUserByEmail = i.nodes.callable({
  category,
  description: 'Find a user with an email address.',

  inputs: {
    email: pins.user.email.with({
      description: 'An email address belonging to a user in the workspace.',
    }),
  },

  outputs: {
    response: pins.user.userLookupResponse.with({
      description: 'User information from email lookup.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.users.lookupByEmail({
      email: opts.inputs.email,
    });

    if (!response.ok) {
      throw new Error(`Failed to lookup user by email: ${response.error}`);
    }

    return opts.next({ response });
  },
});
