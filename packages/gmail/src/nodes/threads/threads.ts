import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import * as pins from '@/pins';

const category = {
  path: ['Threads'],
} satisfies i.NodeCategory;

export const getThread = i.nodes.callable({
  category,
  description: 'Retrieve a specific Gmail conversation thread by ID',

  inputs: {
    id: pins.thread.id,
    format: pins.query.messageFormat.with({
      optional: true,
    }),
  },

  outputs: {
    thread: pins.thread.item,
  },

  async run(opts) {
    const response = await opts.state.gmail.users.threads.get({
      userId: 'me',
      id: opts.inputs.id,
      format: opts.inputs.format,
    });

    return opts.next({
      thread: response.data,
    });
  },
});

export const listThreads = i.nodes.callable({
  category,
  description: 'Search and retrieve Gmail conversation threads',

  inputs: {
    maxResults: pins.query.maxResults,
    query: pins.query.searchQuery.with({
      optional: true,
    }),
    labelIds: pins.label.ids.with({
      optional: true,
    }),
  },

  outputs: {
    threads: i.pins.data({
      schema: v.array(v.any()),
    }),
    resultSizeEstimate: i.pins.data({
      displayName: 'Total Results',
      schema: v.number(),
    }),
  },

  async run(opts) {
    const response = await opts.state.gmail.users.threads.list({
      userId: 'me',
      q: opts.inputs.query,
      labelIds: opts.inputs.labelIds,
      maxResults: opts.inputs.maxResults,
    });

    return opts.next({
      threads: response.data.threads ?? [],
      resultSizeEstimate: response.data.resultSizeEstimate ?? 0,
    });
  },
});

export const modifyThread = i.nodes.callable({
  category,
  description: 'Add or remove labels from all messages in a thread',

  inputs: {
    id: pins.thread.id,
    addLabelIds: pins.label.ids.with({
      displayName: 'Add Labels',
      description: 'Label IDs to add to all messages in the thread',
      optional: true,
    }),
    removeLabelIds: pins.label.ids.with({
      displayName: 'Remove Labels',
      description: 'Label IDs to remove from all messages in the thread',
      optional: true,
    }),
  },

  outputs: {
    thread: pins.thread.item,
  },

  async run(opts) {
    const response = await opts.state.gmail.users.threads.modify({
      userId: 'me',
      id: opts.inputs.id,
      requestBody: {
        addLabelIds: opts.inputs.addLabelIds,
        removeLabelIds: opts.inputs.removeLabelIds,
      },
    });

    return opts.next({
      thread: response.data,
    });
  },
});

export const deleteThread = i.nodes.callable({
  category,
  description: 'Permanently delete an entire conversation thread',

  inputs: {
    id: pins.thread.id,
  },

  async run(opts) {
    await opts.state.gmail.users.threads.delete({
      userId: 'me',
      id: opts.inputs.id,
    });
  },
});
