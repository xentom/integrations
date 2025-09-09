import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import * as pins from '../../pins';

const category = {
  path: ['Labels'],
} satisfies i.NodeCategory;

export const listLabels = i.nodes.callable({
  category,
  description: 'Retrieve all Gmail labels',

  outputs: {
    labels: pins.label.items,
  },

  async run(opts) {
    const response = await opts.state.gmail.users.labels.list({
      userId: 'me',
    });

    return opts.next({
      labels: response.data.labels ?? [],
    });
  },
});

export const getLabel = i.nodes.callable({
  category,
  description: 'Retrieve a specific Gmail label by ID',

  inputs: {
    id: pins.label.id,
  },

  outputs: {
    label: pins.label.item,
  },

  async run(opts) {
    const response = await opts.state.gmail.users.labels.get({
      userId: 'me',
      id: opts.inputs.id,
    });

    return opts.next({
      label: response.data,
    });
  },
});

export const createLabel = i.nodes.callable({
  category,
  description: 'Create a new Gmail label',

  inputs: {
    name: i.pins.data({
      displayName: 'Label Name',
      description: 'Name for the new label',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'My Custom Label',
      }),
    }),
    messageListVisibility: i.pins.data({
      displayName: 'Message List Visibility',
      description: 'Whether to show or hide the label in the message list',
      schema: v.picklist(['show', 'hide']),
      control: i.controls.select({
        options: [
          { value: 'show', label: 'Show in message list' },
          { value: 'hide', label: 'Hide from message list' },
        ],
      }),
      optional: true,
    }),
    labelListVisibility: i.pins.data({
      displayName: 'Label List Visibility',
      description: 'How to display the label in the label list',
      schema: v.picklist(['labelShow', 'labelShowIfUnread', 'labelHide']),
      control: i.controls.select({
        options: [
          { value: 'labelShow', label: 'Always show' },
          { value: 'labelShowIfUnread', label: 'Show if unread' },
          { value: 'labelHide', label: 'Hide' },
        ],
      }),
      optional: true,
    }),
  },

  outputs: {
    label: pins.label.item,
  },

  async run(opts) {
    const response = await opts.state.gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: opts.inputs.name,
        messageListVisibility: opts.inputs.messageListVisibility,
        labelListVisibility: opts.inputs.labelListVisibility,
      },
    });

    return opts.next({
      label: response.data,
    });
  },
});

export const deleteLabel = i.nodes.callable({
  category,
  description: 'Delete a Gmail label (cannot delete system labels)',

  inputs: {
    id: pins.label.id,
  },

  async run(opts) {
    await opts.state.gmail.users.labels.delete({
      userId: 'me',
      id: opts.inputs.id,
    });
  },
});

export const modifyMessageLabels = i.nodes.callable({
  category,
  description: 'Add or remove labels from a message',

  inputs: {
    id: pins.message.id,
    addLabelIds: pins.label.ids.with({
      description: 'Label IDs to add to the message',
      optional: true,
    }),
    removeLabelIds: pins.label.ids.with({
      description: 'Label IDs to remove from the message',
      optional: true,
    }),
  },

  outputs: {
    message: pins.message.item,
  },

  async run(opts) {
    const response = await opts.state.gmail.users.messages.modify({
      userId: 'me',
      id: opts.inputs.id,
      requestBody: {
        addLabelIds: opts.inputs.addLabelIds,
        removeLabelIds: opts.inputs.removeLabelIds,
      },
    });

    return opts.next({
      message: response.data,
    });
  },
});
