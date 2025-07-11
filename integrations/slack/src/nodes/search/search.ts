import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Search'],
} satisfies i.NodeCategory;

export const searchMessages = i.nodes.callable({
  category,
  description: 'Search for messages in Slack.',

  inputs: {
    query: pins.search.query.with({
      description: 'Search query for messages.',
    }),
    sort: pins.search.sort.with({
      description: 'Sort order for results.',
    }),
    sortDir: pins.search.sortDir.with({
      description: 'Sort direction (asc or desc).',
    }),
    highlight: pins.search.highlight.with({
      description: 'Enable search term highlighting.',
    }),
    count: pins.common.limit.with({
      description: 'Number of results to return.',
    }),
    page: pins.reaction.page.with({
      description: 'Page number for pagination.',
    }),
  },

  outputs: {
    response: pins.search.messagesSearchResponse.with({
      description: 'Search results for messages.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.search.messages({
      query: opts.inputs.query,
      sort: opts.inputs.sort,
      sort_dir: opts.inputs.sortDir,
      highlight: opts.inputs.highlight,
      count: opts.inputs.count,
      page: opts.inputs.page ? Number(opts.inputs.page) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to search messages: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const searchFiles = i.nodes.callable({
  category,
  description: 'Search for files in Slack.',

  inputs: {
    query: pins.search.query.with({
      description: 'Search query for files.',
    }),
    sort: pins.search.sort.with({
      description: 'Sort order for results.',
    }),
    sortDir: pins.search.sortDir.with({
      description: 'Sort direction (asc or desc).',
    }),
    highlight: pins.search.highlight.with({
      description: 'Enable search term highlighting.',
    }),
    count: pins.common.limit.with({
      description: 'Number of results to return.',
    }),
    page: pins.reaction.page.with({
      description: 'Page number for pagination.',
    }),
  },

  outputs: {
    response: pins.search.filesSearchResponse.with({
      description: 'Search results for files.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.search.files({
      query: opts.inputs.query,
      sort: opts.inputs.sort,
      sort_dir: opts.inputs.sortDir,
      highlight: opts.inputs.highlight,
      count: opts.inputs.count,
      page: opts.inputs.page ? Number(opts.inputs.page) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to search files: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const searchAll = i.nodes.callable({
  category,
  description: 'Search for both messages and files in Slack.',

  inputs: {
    query: pins.search.query.with({
      description: 'Search query for all content.',
    }),
    sort: pins.search.sort.with({
      description: 'Sort order for results.',
    }),
    sortDir: pins.search.sortDir.with({
      description: 'Sort direction (asc or desc).',
    }),
    highlight: pins.search.highlight.with({
      description: 'Enable search term highlighting.',
    }),
    count: pins.common.limit.with({
      description: 'Number of results to return.',
    }),
    page: pins.reaction.page.with({
      description: 'Page number for pagination.',
    }),
  },

  outputs: {
    response: pins.search.allSearchResponse.with({
      description: 'Search results for all content.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.search.all({
      query: opts.inputs.query,
      sort: opts.inputs.sort,
      sort_dir: opts.inputs.sortDir,
      highlight: opts.inputs.highlight,
      count: opts.inputs.count,
      page: opts.inputs.page ? Number(opts.inputs.page) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to search all content: ${response.error}`);
    }

    return opts.next({ response });
  },
});
