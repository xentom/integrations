import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Team'],
} satisfies i.NodeCategory;

export const getTeamInfo = i.nodes.callable({
  category,
  description: 'Get information about the Slack team/workspace.',

  inputs: {
    team: pins.team.teamId.with({
      description: 'Team ID to get info for (optional for current team).',
      optional: true,
    }),
  },

  outputs: {
    response: pins.team.teamInfoResponse.with({
      description: 'Information about the team.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.team.info({
      team: opts.inputs.team,
    });

    if (!response.ok) {
      throw new Error(`Failed to get team info: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getAccessLogs = i.nodes.callable({
  category,
  description: 'Get access logs for the team.',

  inputs: {
    before: pins.team.before.with({
      description: 'End of time range of logs to include.',
      optional: true,
    }),
    count: pins.common.limit.with({
      description: 'Number of items to return.',
      optional: true,
    }),
    page: pins.reaction.page.with({
      description: 'Page number for pagination.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.team.accessLogsResponse.with({
      description: 'Team access logs.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.team.accessLogs({
      before: opts.inputs.before ? Number(opts.inputs.before) : undefined,
      count: opts.inputs.count,
      page: opts.inputs.page ? Number(opts.inputs.page) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to get access logs: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getBillableInfo = i.nodes.callable({
  category,
  description: 'Get billable information for team members.',

  inputs: {
    user: pins.user.userId.with({
      description: 'User to get billable info for (optional for all users).',
      optional: true,
    }),
  },

  outputs: {
    response: pins.team.billableInfoResponse.with({
      description: 'Billable information for team members.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.team.billableInfo({
      user: opts.inputs.user,
    });

    if (!response.ok) {
      throw new Error(`Failed to get billable info: ${response.error}`);
    }

    return opts.next({ response });
  },
});
