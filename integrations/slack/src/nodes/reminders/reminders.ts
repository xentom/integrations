import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Reminders'],
} satisfies i.NodeCategory;

export const addReminder = i.nodes.callable({
  category,
  description: 'Create a reminder.',

  inputs: {
    text: pins.reminder.text.with({
      description: 'The content of the reminder.',
    }),
    time: pins.reminder.time.with({
      description:
        'When the reminder should be sent (timestamp or natural language).',
    }),
    user: pins.user.userId.with({
      description: 'User who will receive the reminder.',
    }),
  },

  outputs: {
    response: pins.reminder.reminderResponse.with({
      description: 'Response from creating the reminder.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reminders.add({
      text: opts.inputs.text,
      time: opts.inputs.time,
      user: opts.inputs.user,
    });

    if (!response.ok) {
      throw new Error(`Failed to add reminder: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const completeReminder = i.nodes.callable({
  category,
  description: 'Mark a reminder as complete.',

  inputs: {
    reminder: pins.reminder.reminderId.with({
      description: 'ID of the reminder to complete.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from completing the reminder.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reminders.complete({
      reminder: opts.inputs.reminder,
    });

    if (!response.ok) {
      throw new Error(`Failed to complete reminder: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const deleteReminder = i.nodes.callable({
  category,
  description: 'Delete a reminder.',

  inputs: {
    reminder: pins.reminder.reminderId.with({
      description: 'ID of the reminder to delete.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from deleting the reminder.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reminders.delete({
      reminder: opts.inputs.reminder,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete reminder: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getReminder = i.nodes.callable({
  category,
  description: 'Get information about a reminder.',

  inputs: {
    reminder: pins.reminder.reminderId.with({
      description: 'ID of the reminder to get information about.',
    }),
  },

  outputs: {
    response: pins.reminder.reminderResponse.with({
      description: 'Information about the reminder.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reminders.info({
      reminder: opts.inputs.reminder,
    });

    if (!response.ok) {
      throw new Error(`Failed to get reminder info: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const listReminders = i.nodes.callable({
  category,
  description: 'List all reminders for the authenticated user.',

  inputs: {},

  outputs: {
    response: pins.reminder.remindersListResponse.with({
      description: 'List of reminders.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reminders.list();

    if (!response.ok) {
      throw new Error(`Failed to list reminders: ${response.error}`);
    }

    return opts.next({ response });
  },
});
